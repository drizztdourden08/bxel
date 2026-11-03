/* @layer renderer-app @kind test */
import { describe, expect, it } from 'vitest';
import { gridsHidden } from '../../src/canvas-look/grids-hidden';
import { CANVAS_DEFAULTS } from '../../src/canvas-look/canvas-look.constants';
import { lookOf } from '../../src/canvas-look/look-of';
import { snapGuide } from '../../src/guides/snap-guide';
import { snapDelta } from '../../src/sheet/snap-delta';
import type { SheetItem } from '../../src/sheet/sheet.type';
import { extraItems } from '../../src/status-extras/extra-items';
import { readExtras } from '../../src/status-extras/read-extras';
import { useViewStore } from '../../src/stores/useViewStore';
import { anchorRect } from '../../src/views/ApplyBar/behavior/anchor-rect';

const look = lookOf(CANVAS_DEFAULTS);
const all = { pixel: true, major: true, tile: true };

describe('K1 the quiet "grid hidden" state', { tags: ['critical'] }, () => {
  it('stays quiet while every grid that is on can be drawn', () => {
    expect(gridsHidden(look, all, 16, 'sprite')).toBe(false);
  });

  it('speaks when the pixel grid is on but the zoom is too low', () => {
    expect(gridsHidden(look, { pixel: true, major: false, tile: false }, 4, 'sprite')).toBe(true);
  });

  it('speaks when the tile grid lines would sit closer than a few pixels', () => {
    expect(gridsHidden(look, { pixel: false, major: false, tile: true }, 0.25, 'sheet')).toBe(true);
    expect(gridsHidden(look, { pixel: false, major: false, tile: true }, 2, 'sheet')).toBe(false);
  });

  it('says nothing about a grid that is off, or before any zoom is known', () => {
    expect(gridsHidden(look, { pixel: false, major: false, tile: false }, 1, 'sprite')).toBe(false);
    expect(gridsHidden(look, all, 0, 'sprite')).toBe(false);
  });
});

describe('K1 the floating Apply bar anchor', { tags: ['critical'] }, () => {
  const scale = (x: number, y: number) => ({ x: x * 4 + 100, y: y * 4 + 50 });

  it('turns the pending pixel box into a screen box for the Tessera bar', () => {
    useViewStore.setState({ viewport: { pixelToScreen: scale } as never });
    expect(anchorRect({ x: 10, y: 5, width: 8, height: 2 })).toEqual({ left: 140, top: 70, width: 32, height: 8 });
  });

  it('gives no box without a selection or a viewport, so the bar docks', () => {
    useViewStore.setState({ viewport: { pixelToScreen: scale } as never });
    expect(anchorRect(null)).toBeNull();
    useViewStore.setState({ viewport: null });
    expect(anchorRect({ x: 0, y: 0, width: 1, height: 1 })).toBeNull();
  });
});

describe('K1 snap', { tags: ['critical'] }, () => {
  const items: SheetItem[] = [{ sprite: { id: 'a', width: 16, height: 16 }, at: { x: 10, y: 20 }, onSheet: true }] as never;
  const ids = ['a'] as never;

  it('moves a sprite onto the nearest cell line', () => {
    expect(snapDelta({ items, ids, delta: { x: 5, y: 3 }, grid: { width: 16, height: 16 }, lines: undefined, reach: 4 })).toEqual({ x: 6, y: -4 });
  });

  it('prefers a guide that is closer than the cell line', () => {
    const lines = { x: [27], y: [] };
    expect(snapDelta({ items, ids, delta: { x: 15, y: 0 }, grid: { width: 16, height: 16 }, lines, reach: 4 }).x).toBe(17);
  });

  it('keeps the move when there is neither a grid nor a guide in reach', () => {
    expect(snapDelta({ items, ids, delta: { x: 5, y: 3 }, grid: null, lines: { x: [100], y: [] }, reach: 4 })).toEqual({ x: 5, y: 3 });
  });

  it('snaps a guide to a step of the grid, inside the image', () => {
    expect(snapGuide(37, 128, false, 16)).toBe(32);
    expect(snapGuide(200, 128, false, 16)).toBe(128);
  });
});

describe('K1 the status items', { tags: ['critical'] }, () => {
  const none = { surface: 'sprite' as const, pointer: null, target: null, slots: [], mask: null, move: null, focus: null, cell: null };

  it('adds nothing without a pointer, a selection or a frame', () => {
    expect(extraItems(readExtras(none))).toEqual([]);
  });

  it('shows the selection size and origin, the drag delta while moving, and the cell and tile on a map', () => {
    const mask = { width: 8, height: 8, bits: new Uint8Array(64).fill(1) };
    const sprite = extraItems(readExtras({ ...none, mask: { ...mask, bits: mask.bits.map((_, at) => (at % 8 >= 2 && at % 8 < 6 && at >> 3 >= 1 && at >> 3 < 3 ? 1 : 0)) }, move: { x: 3, y: -2 } }));
    expect(sprite.map((item) => [item.id, item.value])).toEqual([['selection', '4 x 2 at 2, 1'], ['drag', '+3, -2']]);
    const map = extraItems(readExtras({ ...none, surface: 'map', cell: { at: { x: 3, y: 5 }, key: 12 } }));
    expect(map.map((item) => [item.id, item.value])).toEqual([['cell', '3, 5'], ['cell-tile', '12']]);
    expect(extraItems(readExtras({ ...none, surface: 'map', cell: { at: { x: 0, y: 0 }, key: null } })).at(-1)?.value).toBe('Empty');
  });
});
