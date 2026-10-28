/* @layer renderer-app @kind test */
import type { ToolbarItem } from '@drizztdourden08/tessera';
import { describe, expect, it, vi } from 'vitest';
import { TOOLS } from '../../src/editor/tools.constants';
import { statusItems } from '../../src/editor/status-items';
import { TOOL_ICONS } from '../../src/icons/tool-icons.constants';
import { MAP_TOOLS } from '../../src/tilemap/map-tools.constants';
import { ruledItems } from '../../src/toolbar-items/ruled-items';
import { tidyItems } from '../../src/toolbar-items/tidy-items';
import { canvasGroups } from '../../src/views/CanvasToolbar/behavior/canvas-groups';
import { railItems } from '../../src/views/ToolRail/behavior/rail-items';
import { COLUMN_NAMES, columnContext } from './columns';
import type { Column } from './columns';

vi.mock('@drizztdourden08/brock-react', async () => (await import('../keymap/brock-react-mock')).brockReactMock());

const keys = { pencil: undefined, eraser: undefined, fill: undefined, picker: undefined, shape: undefined, zoom: undefined, hand: undefined, select: undefined, move: undefined };

const railOf = (column: Column): ToolbarItem[] => {
  const context = columnContext(column);
  return railItems({ defs: context.surface === 'map' ? MAP_TOOLS : TOOLS, tool: 'pencil', pick: () => undefined, keys, options: {}, icons: TOOL_ICONS, context });
};

const labelsOf = (items: readonly ToolbarItem[]): string[] => items.flatMap((item) => (item.kind === 'separator' ? [] : [item.label]));

const button = (id: string): ToolbarItem => ({ kind: 'button', id, label: id, icon: 'check', onSelect: () => undefined });

describe('the tool rail per context', () => {
  it('lists the nine pixel tools on a sprite, an animation and a tile', () => {
    for (const column of ['Sp', 'Se', 'An', 'Si', 'Ts', 'Te'] as const) expect(railOf(column)).toHaveLength(TOOLS.length + 2);
  });

  it('lists the map tools on a map', () => {
    expect(labelsOf(railOf('Tm'))).toEqual(['Place', 'Erase', 'Fill', 'Pick', 'Rectangle', 'Select', 'Zoom', 'Hand']);
  });

  it('keeps only Zoom and Hand on a sheet and on an image and draws nothing on a palette', () => {
    expect(labelsOf(railOf('Sh'))).toEqual(['Zoom', 'Hand']);
    expect(labelsOf(railOf('Im'))).toEqual(['Zoom', 'Hand']);
    expect(railOf('Pa')).toEqual([]);
  });

  it('disables every tool with the hint when nothing is open', () => {
    const items = railOf('N');
    expect(items.length).toBeGreaterThan(0);
    for (const item of items) {
      if (item.kind === 'separator') continue;
      expect(item.disabled).toBe(true);
      expect(item.description).toBe('Open or create an asset to draw.');
    }
  });

  it('keeps Select, Zoom, Hand and Picker live and disables the rest on a read only file', () => {
    const live = railOf('Ro').flatMap((item) => (item.kind !== 'separator' && item.disabled !== true ? [item.label] : []));
    expect(live).toEqual(['Picker', 'Select', 'Zoom', 'Hand']);
  });
});

describe('the canvas toolbar per context', () => {
  const groups = [
    { id: 'scope', items: [button('back')] },
    { id: 'symmetry', items: [button('mirror-x'), button('mirror-y')] },
    { id: 'view', items: [button('grid'), button('guides'), button('tiled')] },
    { id: 'playback', items: [button('onion'), button('play')] },
    { id: 'zoom', items: [button('zoom-fit'), button('zoom-actual')] },
  ];
  const idsOn = (column: Column): string[] => canvasGroups(columnContext(column), groups).flatMap((item) => (item.kind === 'separator' ? [] : [item.id]));

  it('draws no bar at all with nothing open or a palette open', () => {
    expect(idsOn('N')).toEqual([]);
    expect(idsOn('Pa')).toEqual([]);
  });

  it('shows no Onion or Play on a still sprite', () => {
    expect(idsOn('Sp')).toEqual(['mirror-x', 'mirror-y', 'grid', 'guides', 'tiled', 'zoom-fit', 'zoom-actual']);
  });

  it('shows Onion and Play on an animation only', () => {
    expect(idsOn('An')).toEqual(['mirror-x', 'mirror-y', 'grid', 'guides', 'tiled', 'onion', 'play', 'zoom-fit', 'zoom-actual']);
  });

  it('shows Back for an isolated sprite and the guides and zoom on a sheet', () => {
    expect(idsOn('Si')[0]).toBe('back');
    expect(idsOn('Sh')).toEqual(['guides', 'zoom-fit', 'zoom-actual']);
  });

  it('keeps the grid and guides on a map, and the pixel grid with the zoom on an image', () => {
    expect(idsOn('Tm')).toEqual(['grid', 'guides', 'zoom-fit', 'zoom-actual']);
    expect(idsOn('Im')).toEqual(['grid', 'zoom-fit', 'zoom-actual']);
  });

  it('puts a separator only between two groups that both show', () => {
    const items = canvasGroups(columnContext('An'), groups);
    const kinds = items.map((item) => item.kind === 'separator');
    expect(kinds[0]).toBe(false);
    expect(kinds[kinds.length - 1]).toBe(false);
    expect(items.filter((item) => item.kind === 'separator')).toHaveLength(3);
  });
});

describe('the ruled items', () => {
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

describe('the status bar per context', () => {
  const input = { pointer: null, zoom: 1, colours: [null, null] as const, clean: true, recovered: false, tile: null };
  const idsOf = (column: Column): string[] => statusItems({ ...input, context: columnContext(column) }).map((item) => item.id);

  it('keeps only Help when nothing is open', () => {
    expect(idsOf('N')).toEqual(['help']);
  });

  it('shows the cursor, the zoom, the held colours and the save state on a sprite', () => {
    expect(idsOf('Sp')).toEqual(['cursor', 'zoom', 'colour-1', 'colour-2', 'saved', 'help']);
  });

  it('shows the picked tile instead of the colours on a map', () => {
    expect(idsOf('Tm')).toEqual(['cursor', 'zoom', 'tile', 'saved', 'help']);
  });

  it('hides the cursor and the zoom on a palette and the save state on an image', () => {
    expect(idsOf('Pa')).toEqual(['saved', 'help']);
    expect(idsOf('Im')).toEqual(['help']);
  });

  it('has an answer for every column', () => {
    for (const column of COLUMN_NAMES) expect(idsOf(column)).toContain('help');
  });
});
