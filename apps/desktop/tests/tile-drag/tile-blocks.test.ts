/* @layer renderer-app @kind test */
import type { MapLayerId, Tilemap, TilemapId, TilesetId } from '@bxel/document';
import { describe, expect, it } from 'vitest';
import { useTilesetViewStore } from '../../src/stores/useTilesetViewStore';
import { tileBlocks } from '../../src/tile-drag/tile-blocks';
import { usedCells } from '../../src/views/TilemapCanvas/behavior/used-cells';

describe('K1 tile blocks from a dropped image', { tags: ['critical'] }, () => {
  it('slices the image into tile sized blocks in reading order', () => {
    const pixels = new Uint8Array(16);
    pixels[0] = 1;
    pixels[2] = 2;
    pixels[8] = 3;
    const blocks = tileBlocks(pixels, { width: 4, height: 4 }, { width: 2, height: 2 });
    expect(blocks.map((block) => [...block.pixels])).toEqual([
      [1, 0, 0, 0],
      [2, 0, 0, 0],
      [3, 0, 0, 0],
    ]);
  });

  it('skips the blocks with no ink and ignores a ragged edge', () => {
    const pixels = new Uint8Array(15);
    pixels[0] = 5;
    const blocks = tileBlocks(pixels, { width: 5, height: 3 }, { width: 2, height: 2 });
    expect(blocks).toHaveLength(1);
    expect(blocks[0]?.width).toBe(2);
  });
});

describe('K2 map hover outline', { tags: ['standard'] }, () => {
  it('lists every visible cell that uses the hovered tile', () => {
    const tilemap: Tilemap = {
      id: 'map' as TilemapId,
      name: 'map',
      tilesetId: 'set' as TilesetId,
      columns: 2,
      rows: 2,
      layers: [
        { id: 'shown' as MapLayerId, name: 'shown', visible: true, locked: false, cells: Uint32Array.from([1, 2, 0, 1]) },
        { id: 'hidden' as MapLayerId, name: 'hidden', visible: false, locked: false, cells: Uint32Array.from([1, 1, 1, 1]) },
      ],
    };
    expect(usedCells(tilemap, 1)).toEqual([
      { x: 0, y: 0 },
      { x: 1, y: 1 },
    ]);
    expect(usedCells(tilemap, 9)).toEqual([]);
  });

  it('keeps the hover key in the tileset view store and ignores an equal value', () => {
    const { setHoverKey } = useTilesetViewStore.getState();
    setHoverKey(4);
    const before = useTilesetViewStore.getState();
    setHoverKey(4);
    expect(useTilesetViewStore.getState()).toBe(before);
    expect(useTilesetViewStore.getState().hoverKey).toBe(4);
    setHoverKey(null);
    expect(useTilesetViewStore.getState().hoverKey).toBeNull();
  });
});
