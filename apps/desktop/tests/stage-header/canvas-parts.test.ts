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
import { placeBar } from '../../src/views/ApplyBar/behavior/place-bar';

const look = lookOf(CANVAS_DEFAULTS);
const all = { pixel: true, major: true, tile: true };

describe('the quiet "grid hidden" state', () => {
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

describe('the floating Apply bar placement', () => {
  const bounds = { left: 0, top: 0, right: 800, bottom: 600 };
  const size = { width: 300, height: 90 };

  it('sits under the selection, centred on it', () => {
    const place = placeBar({ left: 300, top: 100, right: 400, bottom: 200 }, bounds, size);
    expect(place.docked).toBe(false);
    expect(place.x).toBe(200);
    expect(place.y).toBeGreaterThan(200);
  });

  it('moves above the selection when there is no room below', () => {
    const place = placeBar({ left: 300, top: 480, right: 400, bottom: 580 }, bounds, size);
    expect(place.y + size.height).toBeLessThanOrEqual(480);
  });

  it('stays inside the stage when the selection hugs an edge', () => {
    const place = placeBar({ left: 0, top: 100, right: 20, bottom: 120 }, bounds, size);
    expect(place.x).toBeGreaterThanOrEqual(0);
    expect(place.x + size.width).toBeLessThanOrEqual(bounds.right);
  });

  it('drops to the top of the stage, marked docked, when the selection is off screen', () => {
    expect(placeBar({ left: 2000, top: 100, right: 2100, bottom: 200 }, bounds, size)).toMatchObject({ docked: true, y: 12 });
    expect(placeBar(null, bounds, size).docked).toBe(true);
  });
});

describe('snap', () => {
  const items = [{ sprite: { id: 'a', width: 16, height: 16 }, at: { x: 10, y: 20 }, onSheet: true }] as unknown as SheetItem[];
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

describe('the status items', () => {
  const none = { surface: 'sprite' as const, pointer: null, target: null, slots: [], mask: null, move: null, focus: null, cell: null };

  it('adds nothing without a pointer, a selection or a frame', () => {
    expect(extraItems(readExtras(none))).toEqual([]);
  });

  it('shows the selection size and origin, the drag delta while moving, and the cell and tile on a map', () => {
    const mask = { width: 8, height: 8, bits: new Uint8Array(64).fill(1) };
    const sprite = extraItems(readExtras({ ...none, mask: { ...mask, bits: mask.bits.map((_, at) => (at % 8 >= 2 && at % 8 < 6 && at >> 3 >= 1 && at >> 3 < 3 ? 1 : 0)) }, move: { x: 3, y: -2 } }));
    expect(sprite.map((item) => [item.id, item.value])).toEqual([['selection', '4 x 2 at 2, 1'], ['drag', '+3, -2']]);
    const map = extraItems(readExtras({ ...none, surface: 'map', cell: { at: { x: 3, y: 5 }, key: 12 } }));
    expect(map.map((item) => [item.id, item.value])).toEqual([['cell', '3, 5'], ['tile', '12']]);
    expect(extraItems(readExtras({ ...none, surface: 'map', cell: { at: { x: 0, y: 0 }, key: null } })).at(-1)?.value).toBe('Empty');
  });
});
