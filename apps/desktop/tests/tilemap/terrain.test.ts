/* @layer renderer-app @kind test */
import { terrainSetsOf, tileLayout } from '@bxel/document';
import type { TerrainSet, Tileset } from '@bxel/document';
import { beforeEach, describe, expect, it } from 'vitest';
import { useTilemapStore } from '../../src/stores/useTilemapStore';
import { addTile } from '../../src/tilemap/add-tile';
import { rectPlace } from '../../src/tilemap/rect-place';
import { setLayout } from '../../src/tilemap/set-layout';
import { setTerrainSets } from '../../src/tilemap/set-terrain-sets';
import { strokeErase } from '../../src/tilemap/stroke-erase';
import { strokePlace } from '../../src/tilemap/stroke-place';
import { fillByTurning } from '../../src/tilemap/terrain/fill-by-turning';
import { fillFromLayout } from '../../src/tilemap/terrain/fill-from-layout';
import { markTile } from '../../src/tilemap/terrain/mark-tile';
import { newTerrainSet } from '../../src/tilemap/terrain/new-terrain-set';
import { missingSlots } from '../../src/tilemap/terrain/missing-slots';
import { PACKINGS } from '../../src/tilemap/terrain/terrain-packing.constants';
import { turnedMask } from '../../src/tilemap/terrain/turned-mask';
import { slotGlyph } from '../../src/tilemap/terrain/slot-glyph';
import { cellsNow, openMapFile, tilesetNow } from './map-harness';

const withSixteenTiles = (): void => {
  openMapFile();
  for (let count = tilesetNow().tiles.length; count < 16; count += 1) addTile();
};

const packing = (id: string) => {
  const found = PACKINGS.find((each) => each.id === id);
  if (!found) throw new Error(`no packing ${id}`);
  return found;
};

const edgeSet = (): TerrainSet => {
  setLayout({ columns: 4 });
  return fillFromLayout(newTerrainSet('blob16', []), tileLayout(tilesetNow()), packing('blob16-4'), 0);
};

describe('S2 terrain set helpers', { tags: ['standard'] }, () => {
  it('starts a set with empty slots for each kind', () => {
    expect(newTerrainSet('blob16', []).slots).toHaveLength(16);
    expect(newTerrainSet('corner16', []).slots).toHaveLength(16);
    expect(newTerrainSet('blob47', []).slots).toHaveLength(47);
    expect(newTerrainSet('blob16', [newTerrainSet('blob16', [])]).id).not.toBe('terrain_1');
  });

  it('fills the slots from the block of the layout that starts at the picked tile', () => {
    withSixteenTiles();
    setLayout({ columns: 4 });
    const filled = fillFromLayout(newTerrainSet('blob16', []), tileLayout(tilesetNow()), packing('blob16-4'), 4);
    expect(filled.slots.slice(0, 12).map((slot) => slot[0]?.key)).toEqual([5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16]);
    expect(missingSlots(filled)).toEqual([12, 13, 14, 15]);
  });

  it('fills all 47 slots from a 6 wide block in one action', () => {
    openMapFile();
    for (let count = tilesetNow().tiles.length; count < 48; count += 1) addTile();
    setLayout({ columns: 6 });
    const filled = fillFromLayout(newTerrainSet('blob47', []), tileLayout(tilesetNow()), packing('blob47-6'), 0);
    expect(missingSlots(filled)).toEqual([]);
  });

  it('puts a tile in the slot of the marks it is given and refuses a mask no slot has', () => {
    const set = newTerrainSet('blob47', []);
    const north = markTile(set, 3, 1);
    expect(north?.slots[1]?.map((variant) => variant.key)).toEqual([3]);
    expect(markTile(set, 3, 2)).toBeNull();
    const moved = north ? markTile(north, 3, 5) : null;
    expect(moved?.slots[1]).toEqual([]);
    expect(moved?.slots[3]?.map((variant) => variant.key)).toEqual([3]);
  });

  it('turns a side mask the way the tile is turned', () => {
    expect(turnedMask(1, { flipX: false, flipY: false, diagonal: true })).toBe(64);
    expect(turnedMask(4 | 1, { flipX: true, flipY: false, diagonal: false })).toBe(64 | 1);
  });

  it('draws the neighbours of a slot as a three by three glyph with the centre on', () => {
    expect(slotGlyph(0)).toEqual([false, false, false, false, true, false, false, false, false]);
    expect(slotGlyph(255).every(Boolean)).toBe(true);
  });

  it('fills empty slots with turned copies only for tiles that allow turns', () => {
    withSixteenTiles();
    const tileset: Tileset = tilesetNow();
    const base = newTerrainSet('blob16', []);
    const sparse = { ...base, slots: base.slots.map((_slot, at) => ([1, 2, 5, 15, 0].includes(at) ? [{ key: at + 1, weight: 1 }] : [])) };
    const allowed = { ...tileset, tiles: tileset.tiles.map((tile) => ({ ...tile, turns: 'all' as const })) };
    const turned = fillByTurning(sparse, allowed);
    expect(turned.slots[4]?.[0]).toMatchObject({ key: 2, flipY: true });
    expect(missingSlots(turned).length).toBeLessThan(missingSlots(sparse).length);
    const none = fillByTurning(sparse, tileset);
    expect(missingSlots(none)).toEqual(missingSlots(sparse));
  });
});

describe('S2 painting with the terrain brush', { tags: ['standard'] }, () => {
  beforeEach(() => {
    withSixteenTiles();
    setTerrainSets([edgeSet()]);
    useTilemapStore.getState().setTerrainBrush(true);
  });

  it('stores the rules in the tileset and paints neighbours that join', () => {
    expect(terrainSetsOf(tilesetNow())[0]?.kind).toBe('blob16');
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
