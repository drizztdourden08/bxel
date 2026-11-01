/* @layer renderer-app @kind test */
import type { ToolbarItem } from '@drizztdourden08/tessera';
import { describe, expect, it, vi } from 'vitest';
import { statusItems } from '../../src/editor/status-items';
import { ruledItems } from '../../src/toolbar-items/ruled-items';
import { tidyItems } from '../../src/toolbar-items/tidy-items';
import { canvasGroups } from '../../src/views/CanvasToolbar/behavior/canvas-groups';
import { columnContext } from './columns';
import { railOf } from './rail-of';
import type { Column } from './columns';

vi.mock('@drizztdourden08/brock-react', async () => (await import('../keymap/brock-react-mock')).brockReactMock());

const button = (id: string): ToolbarItem => ({ kind: 'button', id, label: id, icon: 'check', onSelect: () => undefined });

describe('K1 the tool rail per context', { tags: ['critical'] }, () => {
  it('keeps Select, Zoom, Hand and Picker live and disables the rest on a read only file', () => {
    const live = railOf('Ro').flatMap((item) => (item.kind !== 'separator' && item.disabled !== true ? [item.label] : []));
    expect(live).toEqual(['Picker', 'Select, Rectangle', 'Zoom', 'Hand']);
  });
});

describe('K1 the canvas toolbar per context', { tags: ['critical'] }, () => {
  const groups = [
    { id: 'scope', items: [button('back')] },
    { id: 'symmetry', items: [button('mirror-x'), button('mirror-y')] },
    { id: 'view', items: [button('grid'), button('guides'), button('tiled')] },
    { id: 'playback', items: [button('onion'), button('play')] },
    { id: 'zoom', items: [button('zoom-fit'), button('zoom-actual')] },
  ];
  const idsOn = (column: Column): string[] => canvasGroups(columnContext(column), groups).flatMap((item) => (item.kind === 'separator' ? [] : [item.id]));

  it('shows Onion and Play on an animation only', () => {
    expect(idsOn('An')).toEqual(['mirror-x', 'mirror-y', 'grid', 'guides', 'tiled', 'onion', 'play', 'zoom-fit', 'zoom-actual']);
  });

  it('puts a separator only between two groups that both show', () => {
    const items = canvasGroups(columnContext('An'), groups);
    const kinds = items.map((item) => item.kind === 'separator');
    expect(kinds[0]).toBe(false);
    expect(kinds[kinds.length - 1]).toBe(false);
    expect(items.filter((item) => item.kind === 'separator')).toHaveLength(3);
  });
});

describe('K1 the ruled items', { tags: ['critical'] }, () => {
  it('dims an item with a reason and drops a hidden one', () => {
    const items = ruledItems([button('transform'), button('mirror-x')], columnContext('Ro'));
    expect(items).toHaveLength(2);
    expect(items[0]).toMatchObject({ id: 'transform', disabled: true, description: 'This file is open read only. Use Save as to edit a copy.' });
    expect(ruledItems([button('mirror-x')], columnContext('Tm'))).toEqual([]);
  });

  it('removes a leading, a trailing and a doubled separator', () => {
    const bar = { kind: 'separator' as const, id: 's' };
    expect(tidyItems([bar, button('a'), bar, bar, button('b'), bar]).map((item) => item.id)).toEqual(['a', 's', 'b']);
  });
});

describe('K1 the status bar per context', { tags: ['critical'] }, () => {
  const input = { pointer: null, zoom: 1, colours: [null, null] as const, clean: true, recovered: false, tile: null };
  const idsOf = (column: Column): string[] => statusItems({ ...input, context: columnContext(column) }).map((item) => item.id);

  it('keeps only Help when nothing is open', () => {
    expect(idsOf('N')).toEqual(['help']);
  });
});
