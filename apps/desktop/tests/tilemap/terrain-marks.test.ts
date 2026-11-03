/* @layer renderer-app @kind test */
import { PACKINGS, terrainSetsOf } from '@bxel/document';
import { beforeEach, describe, expect, it } from 'vitest';
import { addTile } from '../../src/tilemap/add-tile';
import { setTerrainSets } from '../../src/tilemap/set-terrain-sets';
import { applyMark } from '../../src/tilemap/terrain/apply-mark';
import { markEdit } from '../../src/tilemap/terrain/mark-edit';
import { newTerrainSet } from '../../src/tilemap/terrain/new-terrain-set';
import { PACKING_ORIGIN } from '../../src/tilemap/terrain/terrain.constants';
import { tilesetDetail } from '../../src/assistant/tools/tileset-detail';
import { artworkNow, openMapFile, tilesetNow } from './map-harness';

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
    expect(markEdit({ set, mask: 0, key: 3, bit: NORTH, on: true }).mask).toBe(NORTH);
    expect(markEdit({ set, mask: NORTH, key: 3, bit: NORTH, on: false }).mask).toBe(0);
    expect(markEdit({ set, mask: NORTH, key: 3, bit: NORTH, on: true }).changed).toBe(false);
    expect(markEdit({ set, mask: 0, key: 3, bit: NORTH, on: false }).changed).toBe(false);
  });

  it('marks the same zone on several tiles when one value is applied across them', () => {
    [2, 3, 4].forEach((key) => applyMark(key, NORTH, true));
    expect(keysOfSlot(1)).toEqual([2, 3, 4]);
  });

  it('clears a zone with the off value and moves the tile to the slot of what is left', () => {
    applyMark(3, NORTH, true);
    applyMark(3, EAST, true);
    expect(keysOfSlot(3)).toEqual([3]);
    applyMark(3, EAST, false);
    expect(keysOfSlot(3)).toEqual([]);
    expect(keysOfSlot(1)).toEqual([3]);
  });
});

describe('S2 the packing menu names where each layout comes from', { tags: ['standard'] }, () => {
  it('names a source for every packing and says Tiled and Godot for the 47 template', () => {
    expect(PACKINGS.every((packing) => PACKING_ORIGIN[packing.id] !== undefined)).toBe(true);
    expect(PACKING_ORIGIN['blob47-12']).toBe('Tiled and Godot');
  });
});

describe('S2 the terrain sets an assistant reads', { tags: ['standard'] }, () => {
  it('gives the neighbour mask of every slot beside the variants', () => {
    openMapFile();
    setTerrainSets([newTerrainSet('blob16', [])]);
    const set = tilesetDetail(artworkNow(), tilesetNow()).terrainSets[0];
    expect(set?.masks).toHaveLength(set?.slots.length ?? -1);
    expect(set?.masks[0]).toBe(0);
    expect(set?.masks[1]).toBe(NORTH);
  });
});
