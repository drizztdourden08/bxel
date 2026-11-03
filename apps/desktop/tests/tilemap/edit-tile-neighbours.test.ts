/* @layer renderer-app @kind test */
import { afterAll, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';
import { editTile } from '../../src/tilemap/edit-tile';
import { firstUse } from '../../src/tilemap/first-use';
import { wrapOf } from '../../src/editor/wrap-of';
import { useDrawingStore } from '../../src/stores/useDrawingStore';
import { neighbourSource } from '../../src/tilemap/neighbour-source';
import { neighbourWrap } from '../../src/tilemap/neighbour-wrap';
import { placeStampAt } from '../../src/tilemap/place-stamp-at';
import { useTilemapStore } from '../../src/stores/useTilemapStore';
import { useViewStore } from '../../src/stores/useViewStore';
import { mapNow, openMapFile } from './map-harness';

beforeEach(openMapFile);

beforeAll(() => {
  vi.stubGlobal('document', { createElement: () => ({ width: 0, height: 0, getContext: () => null }) });
});

afterAll(() => {
  vi.unstubAllGlobals();
});

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

  it('lets a stroke cross into a neighbour only where the same tile sits beside it', () => {
    placeStampAt([{ x: 1, y: 1 }]);
    expect(editTile(2)).toBe(true);
    expect(neighbourWrap()).toEqual({ x: false, y: false });
    placeStampAt([{ x: 2, y: 1 }]);
    expect(neighbourWrap()).toEqual({ x: true, y: false });
    placeStampAt([{ x: 1, y: 2 }]);
    expect(neighbourWrap()).toEqual({ x: true, y: true });
  });

  it('wraps painting with the neighbour wrap in Edit Tile unless Lock to tile is on', () => {
    placeStampAt([{ x: 1, y: 1 }, { x: 2, y: 1 }]);
    expect(editTile(2)).toBe(true);
    useViewStore.getState().setTiled('off');
    expect(wrapOf()).toEqual({ x: true, y: false });
    useDrawingStore.getState().patch({ lockToTile: true });
    expect(wrapOf()).toEqual({ x: false, y: false });
    useDrawingStore.getState().patch({ lockToTile: false });
  });
});
