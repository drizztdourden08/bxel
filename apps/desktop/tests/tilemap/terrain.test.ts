/* @layer renderer-app @kind test */
import { beforeEach, describe, expect, it } from 'vitest';
import { useTilemapStore } from '../../src/stores/useTilemapStore';
import { addTile } from '../../src/tilemap/add-tile';
import { rectPlace } from '../../src/tilemap/rect-place';
import { setTerrain } from '../../src/tilemap/set-terrain';
import { strokeErase } from '../../src/tilemap/stroke-erase';
import { strokePlace } from '../../src/tilemap/stroke-place';
import { assignSlot } from '../../src/tilemap/terrain/assign-slot';
import { emptyRules } from '../../src/tilemap/terrain/empty-rules';
import { fillSlots } from '../../src/tilemap/terrain/fill-slots';
import { slotGlyph } from '../../src/tilemap/terrain/slot-glyph';
import { cellsNow, openMapFile, tilesetNow } from './map-harness';

const withSixteenTiles = (): void => {
  openMapFile();
  for (let count = tilesetNow().tiles.length; count < 16; count += 1) addTile();
};

describe('terrain rule helpers', () => {
  it('starts with empty slots and toggles a slot with the same tile', () => {
    const rules = emptyRules('blob16');
    expect(rules.keys).toEqual(new Array(16).fill(0));
    const set = assignSlot(rules, 3, 7);
    expect(set.keys[3]).toBe(7);
    expect(assignSlot(set, 3, 7).keys[3]).toBe(0);
  });

  it('fills the slots with the tiles that follow the picked one and leaves the rest empty', () => {
    withSixteenTiles();
    const filled = fillSlots(emptyRules('blob16'), tilesetNow(), 5);
    expect(filled.keys.slice(0, 12)).toEqual([5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16]);
    expect(filled.keys.slice(12)).toEqual([0, 0, 0, 0]);
  });

  it('draws the neighbours of a slot as a three by three glyph with the centre on', () => {
    expect(slotGlyph(0)).toEqual([false, false, false, false, true, false, false, false, false]);
    expect(slotGlyph(255).every(Boolean)).toBe(true);
  });
});

describe('painting with the terrain brush', () => {
  beforeEach(() => {
    withSixteenTiles();
    setTerrain(fillSlots(emptyRules('blob16'), tilesetNow(), 1));
    useTilemapStore.getState().setTerrainBrush(true);
  });

  it('stores the rules in the tileset and paints neighbours that join', () => {
    expect(tilesetNow().terrain?.kind).toBe('blob16');
    expect(strokePlace([{ x: 1, y: 1 }, { x: 2, y: 1 }])).toBe(true);
    const cells = cellsNow();
    expect([cells[5], cells[6]]).toEqual([1 + 2, 1 + 8]);
  });

  it('erases through the rules and re-joins what is left', () => {
    strokePlace([{ x: 1, y: 1 }, { x: 2, y: 1 }]);
    strokeErase([{ x: 2, y: 1 }]);
    const cells = cellsNow();
    expect([cells[5], cells[6]]).toEqual([1, 0]);
  });

  it('fills a rectangle with terrain and leaves the picked stamp alone', () => {
    rectPlace({ x: 0, y: 0, width: 3, height: 3 });
    expect(cellsNow()[5]).toBe(16);
    expect(useTilemapStore.getState().stamp.keys).toEqual([16]);
  });

  it('places the picked tile as before when the brush is off', () => {
    useTilemapStore.getState().setTerrainBrush(false);
    strokePlace([{ x: 0, y: 0 }]);
    expect(cellsNow()[0]).toBe(16);
  });
});
