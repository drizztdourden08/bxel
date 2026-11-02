/* @layer renderer-app @kind test */
import { beforeEach, describe, expect, it } from 'vitest';
import { editTile } from '../../src/tilemap/edit-tile';
import { firstUse } from '../../src/tilemap/first-use';
import { neighbourSource } from '../../src/tilemap/neighbour-source';
import { placeStampAt } from '../../src/tilemap/place-stamp-at';
import { useTilemapStore } from '../../src/stores/useTilemapStore';
import { mapNow, openMapFile } from './map-harness';

beforeEach(openMapFile);

describe('W7 Edit Tile shows the neighbours from the map', { tags: ['standard'] }, () => {
  it('finds the first place the tile is used', () => {
    placeStampAt([{ x: 2, y: 1 }, { x: 3, y: 2 }]);
    expect(firstUse(mapNow(), 2)).toEqual({ x: 2, y: 1 });
    expect(firstUse(mapNow(), 1)).toBeNull();
  });

  it('gives no neighbours while placing tiles or when the tile is not on the map', () => {
    placeStampAt([{ x: 1, y: 1 }]);
    expect(neighbourSource()).toBeNull();
    useTilemapStore.getState().setStamp({ columns: 1, rows: 1, keys: [1] });
    expect(editTile(1)).toBe(true);
    expect(neighbourSource()).toBeNull();
  });

  it('gives the flat map around the edited tile once the tile is on the map', () => {
    placeStampAt([{ x: 1, y: 1 }]);
    expect(editTile(2)).toBe(true);
    const source = neighbourSource();
    expect(source).toMatchObject({ at: { x: 1, y: 1 }, columns: 4, rows: 3, tileWidth: 2, tileHeight: 2 });
    expect(source?.canvas.width).toBe(8);
  });
});
