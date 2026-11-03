/* @layer renderer-app @kind test */
import { terrainSetsOf } from '@bxel/document';
import { beforeEach, describe, expect, it } from 'vitest';
import { addTile } from '../../src/tilemap/add-tile';
import { setTerrainSets } from '../../src/tilemap/set-terrain-sets';
import { applyMark } from '../../src/tilemap/terrain/apply-mark';
import { markEdit } from '../../src/tilemap/terrain/mark-edit';
import { newTerrainSet } from '../../src/tilemap/terrain/new-terrain-set';
import { openMapFile, tilesetNow } from './map-harness';

const NORTH = 1;
const EAST = 4;

const keysOfSlot = (slot: number): number[] => (terrainSetsOf(tilesetNow())[0]?.slots[slot] ?? []).map((variant) => variant.key);

describe('S2 marking terrain on tiles by dragging', { tags: ['standard'] }, () => {
  beforeEach(() => {
    openMapFile();
    for (let count = tilesetNow().tiles.length; count < 6; count += 1) addTile();
    setTerrainSets([newTerrainSet('blob16', [])]);
  });

  it('turns one zone on or off and reports no change when it already is', () => {
    const set = newTerrainSet('blob16', []);
    expect(markEdit(set, 0, 3, NORTH, true).mask).toBe(NORTH);
    expect(markEdit(set, NORTH, 3, NORTH, false).mask).toBe(0);
    expect(markEdit(set, NORTH, 3, NORTH, true).changed).toBe(false);
    expect(markEdit(set, 0, 3, NORTH, false).changed).toBe(false);
  });

  it('marks the same zone on several tiles when one value is applied across them', () => {
    [2, 3, 4].forEach((key) => applyMark(key, NORTH, true));
    expect(keysOfSlot(1)).toEqual([2, 3, 4]);
  });

  it('clears a zone with the off value and moves the tile to the slot of what is left', () => {
    applyMark(3, NORTH, true);
    applyMark(3, EAST, true);
    expect(keysOfSlot(5)).toEqual([3]);
    applyMark(3, EAST, false);
    expect(keysOfSlot(5)).toEqual([]);
    expect(keysOfSlot(1)).toEqual([3]);
  });
});
