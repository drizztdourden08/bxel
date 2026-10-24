/* @layer renderer-app @kind test */
import type { Tile } from '@bxel/document';
import { describe, expect, it } from 'vitest';
import { TILEMAP_ICONS } from '../../src/icons/tilemap-icons.constants';
import { PIXEL_ICON_SIZE } from '../../src/icons/pixel-icon.constants';
import { rectStamp } from '../../src/views/TilesetPanel/behavior/rect-stamp';
import { usableStamp } from '../../src/tilemap/usable-stamp';
import { stampPlacements } from '../../src/tilemap/stamp-placements';
import { tilesetOf } from './tile-fixture';

const tiles = (count: number): Tile[] =>
  Array.from({ length: count }, (_, at) => ({ id: `til_${at}` as Tile['id'], key: at + 1, spriteId: `spr_${at}` as Tile['spriteId'] }));

describe('picking a rectangle of tiles', () => {
  it('builds a stamp from two corners of the tile grid in any direction', () => {
    expect(rectStamp(tiles(7), 1, 7, 5)).toEqual({ columns: 2, rows: 2, keys: [2, 3, 7, 0] });
    expect(rectStamp(tiles(7), 7, 1, 5)).toEqual(rectStamp(tiles(7), 1, 7, 5));
    expect(rectStamp(tiles(7), 3, 3, 5)).toEqual({ columns: 1, rows: 1, keys: [4] });
  });

  it('drops keys the tileset no longer has', () => {
    const stamp = usableStamp({ columns: 2, rows: 1, keys: [1, 9] }, tilesetOf(2));
    expect(stamp.keys).toEqual([1, 0]);
  });

  it('places the cells of a stamp that fit in the map and skips empty ones', () => {
    const map = { columns: 3, rows: 2 } as Parameters<typeof stampPlacements>[2];
    const placed = stampPlacements({ columns: 2, rows: 2, keys: [1, 0, 2, 3] }, { x: 2, y: 0 }, map);
    expect(placed.map((item) => [item.key, item.cell.x, item.cell.y])).toEqual([[1, 2, 0], [2, 2, 1]]);
  });
});

describe('the tilemap icons', () => {
  it('are 16 by 16 bitmaps made of the three pixel marks', () => {
    for (const [name, bitmap] of Object.entries(TILEMAP_ICONS)) {
      expect(bitmap, name).toHaveLength(PIXEL_ICON_SIZE);
      for (const row of bitmap) expect(row, name).toMatch(/^[.#+]{16}$/);
    }
  });

  it('name the eleven tilemap actions', () => {
    expect(Object.keys(TILEMAP_ICONS).sort()).toEqual(
      ['flipTileX', 'flipTileY', 'mapErase', 'mapFill', 'mapLayerAdd', 'mapPaint', 'mapPick', 'mapRect', 'tileAdd', 'tileUnique', 'tileset'].sort(),
    );
  });
});
