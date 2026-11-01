/* @layer renderer-app @kind test */
import { describe, expect, it } from 'vitest';
import type { LayerRowKind, LayerRowModel } from '../../src/views/LayerStack/LayerStack.type';
import { blockIds } from '../../src/views/LayerStack/behavior/block-ids';
import { dropWish } from '../../src/views/LayerStack/behavior/drop-wish';
import { indentWish } from '../../src/views/LayerStack/behavior/indent-wish';
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

  it('drops a row between two children into that group at the right place', () => {
    expect(dropWish(rows, 3, 1)).toEqual({ keys: ['loose'], parentKey: 'outer', index: 0 });
    expect(dropWish(rows, 3, 2)).toEqual({ keys: ['loose'], parentKey: 'outer', index: 1 });
  });

  it('drops a group to the end of the top level and ignores a missing row', () => {
    expect(dropWish(rows, 0, 99)).toEqual({ keys: ['outer'], parentKey: null, index: 1 });
    expect(dropWish(rows, 9, 0)).toBeNull();
  });

  it('moves a child out of its group to just above the group', () => {
    expect(outdentWish(rows, 'first')).toEqual({ keys: ['first'], parentKey: null, index: 0 });
    expect(outdentWish(rows, 'loose')).toBeNull();
  });

  it('moves a row into the group right above it, as its last child', () => {
    expect(indentWish(rows, 'loose')).toEqual({ keys: ['loose'], parentKey: 'outer', index: 2 });
  });

  it('refuses to move a row inward when nothing or no group sits above it', () => {
    expect(indentWish(rows, 'outer')).toBeNull();
    expect(indentWish(rows, 'second')).toBeNull();
    expect(indentWish(rows, 'absent')).toBeNull();
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
