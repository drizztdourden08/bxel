/* @layer renderer-app @kind test */
import { describe, expect, it } from 'vitest';
import type { LayerRowKind, LayerRowModel } from '../../src/views/LayerStack/LayerStack.type';
import { blockIds } from '../../src/views/LayerStack/behavior/block-ids';
import { dropFits } from '../../src/views/LayerStack/behavior/drop-fits';
import { layerNodes } from '../../src/views/LayerStack/behavior/layer-nodes';
import { pickFromSet } from '../../src/views/LayerStack/behavior/pick-from-set';
import { outdentWish } from '../../src/editor/outdent-wish';
import { visibleRows } from '../../src/views/LayerStack/behavior/visible-rows';

const row = (id: string, kind: LayerRowKind, parentId: string | null): LayerRowModel => ({
  id,
  name: id,
  visible: true,
  mixedVisible: false,
  lock: 'none',
  mixedLock: false,
  colour: null,
  note: null,
  thumb: null,
  kind,
  depth: parentId === null ? 0 : 1,
  parentId,
  childCount: 0,
  viewOpacity: 1,
  clip: false,
  exported: true,
  missing: false,
});

const outer = row('outer', 'group', null);
const first = row('first', 'pixel', 'outer');
const second = row('second', 'pixel', 'outer');
const loose = row('loose', 'pixel', null);
const rows: readonly LayerRowModel[] = [outer, first, second, loose];

describe('K1 layer tree wishes from the list gestures', { tags: ['critical'] }, () => {
  it('takes a group together with everything inside it as one block', () => {
    expect([...blockIds(rows, 'outer')]).toEqual(['outer', 'first', 'second']);
    expect([...blockIds(rows, 'loose')]).toEqual(['loose']);
  });

  it('nests the rows by their parent and keeps an orphan at the top', () => {
    const nodes = layerNodes(rows);
    expect(nodes.map((node) => node.row.id)).toEqual(['outer', 'loose']);
    expect(nodes[0]?.children.map((node) => node.row.id)).toEqual(['first', 'second']);
    expect(layerNodes([first]).map((node) => node.row.id)).toEqual(['first']);
  });

  it('lets a row drop into a group and refuses a block that would sit too deep', () => {
    expect(dropFits(rows, { keys: ['loose'], parentKey: 'outer' })).toBe(true);
    expect(dropFits(rows, { keys: ['loose'], parentKey: null })).toBe(true);
    const inner = { ...row('inner', 'group', 'outer'), depth: 1 };
    const solo = row('solo', 'group', null);
    const kid = row('kid', 'pixel', 'solo');
    const nested = [outer, inner, loose, solo, kid];
    expect(dropFits(nested, { keys: ['loose'], parentKey: 'inner' })).toBe(true);
    expect(dropFits(nested, { keys: ['solo'], parentKey: 'inner' })).toBe(false);
  });

  it('turns a set of keys from the list into one pick', () => {
    const order = ['outer', 'first', 'second', 'loose'];
    const state = { order, selected: ['first'], anchor: 'first', active: 'first' };
    expect(pickFromSet(state, new Set())).toBeNull();
    expect(pickFromSet(state, new Set(['loose']))?.selected).toEqual(['loose']);
    const added = pickFromSet(state, new Set(['first', 'loose']));
    expect(added?.active).toBe('loose');
    expect(added?.selected).toEqual(['first', 'loose']);
  });

  it('moves a child out of its group to just above the group', () => {
    expect(outdentWish(rows, 'first')).toEqual({ keys: ['first'], parentKey: null, index: 0 });
    expect(outdentWish(rows, 'loose')).toBeNull();
  });

  it('hides the children of a folded group and keeps the rest', () => {
    expect(visibleRows(rows, ['outer']).map((each) => each.id)).toEqual(['outer', 'loose']);
    expect(visibleRows(rows, [])).toBe(rows);
  });

  it('hides rows under a folded group at any depth', () => {
    const inner = row('inner', 'group', 'outer');
    const deep = row('deep', 'pixel', 'inner');
    const tree = [outer, inner, deep, loose];
    expect(visibleRows(tree, ['outer']).map((each) => each.id)).toEqual(['outer', 'loose']);
    expect(visibleRows(tree, ['inner']).map((each) => each.id)).toEqual(['outer', 'inner', 'loose']);
  });
});
