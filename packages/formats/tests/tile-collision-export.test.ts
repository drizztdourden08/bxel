/* @layer tests @kind test */
import { writeTiledJson, writeTilemapJson } from '@bxel/formats';
import type { TilemapExportInput, TileShape } from '@bxel/formats';
import { describe, expect, it } from 'vitest';
import { makeMapInput, parseMap } from './make-tilemap-input';

const shapes: Readonly<Record<number, TileShape>> = {
  5: { kind: 'full' },
  9: { kind: 'rect', x: 0, y: 1, width: 2, height: 1 },
  12: { kind: 'polygon', points: [{ x: 0, y: 0 }, { x: 2, y: 0 }, { x: 0, y: 2 }] },
};

const shaped = (): TilemapExportInput => {
  const input = makeMapInput([5, 9, 0, 12]);
  return { ...input, tileset: { ...input.tileset, tiles: input.tileset.tiles.map((tile) => ({ ...tile, collision: shapes[tile.key] as TileShape })) } };
};

type TiledTile = {
  readonly id: number;
  readonly properties: readonly { name: string; value: string }[];
  readonly objectgroup: { readonly objects: readonly Record<string, unknown>[] };
};

const tiledTiles = (): TiledTile[] => {
  const result = writeTiledJson(shaped());
  if (!result.ok) throw new Error(result.message);
  const map = JSON.parse(result.json) as { nextobjectid: number; tilesets: { tiles: TiledTile[] }[] };
  expect(map.nextobjectid).toBe(4);
  return map.tilesets[0]?.tiles ?? [];
};

describe('collision in the Bxel map JSON', () => {
  it('lists the shape of each tile beside its key and position', () => {
    const result = writeTilemapJson(shaped());
    const json = parseMap(result);
    expect(json.tileset.tiles).toEqual([
      { key: 5, x: 0, y: 0, collision: shapes[5] },
      { key: 9, x: 2, y: 0, collision: shapes[9] },
      { key: 12, x: 0, y: 2, collision: shapes[12] },
    ]);
  });

  it('leaves tiles without a shape unchanged', () => {
    const json = parseMap(writeTilemapJson(makeMapInput([5, 9, 0, 12])));
    expect(json.tileset.tiles[0]).toEqual({ key: 5, x: 0, y: 0 });
  });
});

describe('collision in the Tiled JSON', () => {
  it('writes a tile object group with the grid id of each tile', () => {
    const tiles = tiledTiles();
    expect(tiles.map((tile) => tile.id)).toEqual([0, 1, 2]);
    expect(tiles.map((tile) => tile.properties[0]?.value)).toEqual(['full', 'rect', 'polygon']);
  });

  it('writes full as a rectangle over the tile, a rectangle as itself and a polygon relative to its first point', () => {
    const [full, rect, polygon] = tiledTiles().map((tile) => tile.objectgroup.objects[0]);
    expect(full).toMatchObject({ x: 0, y: 0, width: 2, height: 2 });
    expect(rect).toMatchObject({ x: 0, y: 1, width: 2, height: 1 });
    expect(polygon).toMatchObject({ x: 0, y: 0, polygon: [{ x: 0, y: 0 }, { x: 2, y: 0 }, { x: 0, y: 2 }] });
  });

  it('writes no tiles list when no tile has a shape', () => {
    const result = writeTiledJson(makeMapInput([5, 9, 0, 12]));
    if (!result.ok) throw new Error(result.message);
    const map = JSON.parse(result.json) as { tilesets: Record<string, unknown>[] };
    expect(map.tilesets[0]).not.toHaveProperty('tiles');
  });
});
