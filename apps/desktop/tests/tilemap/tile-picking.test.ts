/* @layer renderer-app @kind test */
import { tileLayout } from '@bxel/document';
import type { Tile } from '@bxel/document';
import { describe, expect, it } from 'vitest';
import { layoutStamp } from '../../src/views/TilesetPanel/behavior/layout-stamp';
import { usableStamp } from '../../src/tilemap/usable-stamp';
import { stampPlacements } from '../../src/tilemap/stamp-placements';
import { tilesetOf } from './tile-fixture';

const tiles = (count: number): Tile[] =>
  Array.from({ length: count }, (_, at) => ({ id: `til_${at}` as Tile['id'], key: at + 1, spriteId: `spr_${at}` as Tile['spriteId'] }));

const layoutOf = (count: number, columns: number, places?: readonly number[]) =>
  tileLayout({
    ...tilesetOf(count),
    columns,
    tiles: tiles(count).map((tile, at) => (places ? { ...tile, layout: places[at] } : tile)),
  });

describe('picking a rectangle of tiles', () => {
  it('builds a stamp from two corners of the tile layout in any direction', () => {
    const layout = layoutOf(7, 5);
    expect(layoutStamp(layout, 1, 7)).toEqual({ columns: 2, rows: 2, keys: [2, 3, 7, 0] });
    expect(layoutStamp(layout, 7, 1)).toEqual(layoutStamp(layout, 1, 7));
    expect(layoutStamp(layout, 3, 3)).toEqual({ columns: 1, rows: 1, keys: [4] });
  });

  it('picks the 2 x 3 block that was drawn on a 6 column sheet', () => {
    const layout = layoutOf(18, 6);
    expect(layoutStamp(layout, 7, 14)).toEqual({ columns: 2, rows: 2, keys: [8, 9, 14, 15] });
    expect(layoutStamp(layout, 6, 14)).toEqual({ columns: 3, rows: 2, keys: [7, 8, 9, 13, 14, 15] });
  });

  it('keeps layout holes as empty cells of the stamp', () => {
    const layout = layoutOf(3, 3, [0, 2, 4]);
    expect(layoutStamp(layout, 0, 5)).toEqual({ columns: 3, rows: 2, keys: [1, 0, 2, 0, 3, 0] });
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
