/* @layer tests @kind test */
import { planTiledImport, readTiledMap, readTiledTileset } from '@bxel/formats';
import type { ResolvedTileset, TiledPlan, TiledTileset } from '@bxel/formats';
import { describe, expect, it } from 'vitest';
import { TMX, TSX, sheetImage, tmjText } from './tiled-fixtures';

const tileset = (text: string): TiledTileset => {
  const result = readTiledTileset(text);
  if (!result.ok) throw new Error(result.message);
  return result.tileset;
};

const planOf = (map: string, sets: readonly ResolvedTileset[]): TiledPlan => {
  const read = readTiledMap(map);
  if (!read.ok) throw new Error(read.message);
  const plan = planTiledImport({ map: read.map, tilesets: sets });
  if (!plan.ok) throw new Error(plan.message);
  return plan;
};

const ground = (): ResolvedTileset => ({
  firstGid: 1,
  tileset: { ...tileset(TSX), spacing: 0, margin: 0 },
  image: sheetImage(2, 2, 4),
  tileImages: new Map(),
});

const props = (): ResolvedTileset => {
  const read = readTiledMap(TMX);
  const embedded = read.ok ? read.map.tilesets[1]?.embedded : null;
  if (!embedded) throw new Error('no props tileset');
  return { firstGid: 5, tileset: embedded, image: sheetImage(2, 1, 4), tileImages: new Map() };
};

describe('planTiledImport', () => {
  it('cuts the tileset images into tiles keyed in gid order and maps the layer cells', () => {
    const plan = planOf(TMX, [props(), ground()]);
    expect(plan.tiles.map((tile) => tile.gid)).toEqual([1, 2, 3, 4, 5, 6]);
    expect(plan).toMatchObject({ columns: 3, rows: 2, tileWidth: 4, tileHeight: 4 });
    expect(Array.from(plan.layers[0]?.cells ?? [])).toEqual([1, 2, 3, 4, 5, 6]);
    expect(Array.from(plan.layers[1]?.cells ?? [])[1]).toBe(0x80000001);
    expect(plan.layers[1]?.visible).toBe(false);
  });

  it('reads tile pixels from the grid, honouring margin and spacing', () => {
    const plan = planOf(tmjText([1, 2, 3, 4]), [ground()]);
    expect(plan.tiles).toHaveLength(4);
    expect(Array.from(plan.tiles[3]?.image.data.subarray(0, 4) ?? [])).toEqual([60, 100, 50, 255]);
  });

  it('reads tiles past a margin and spacing', () => {
    const spaced = sheetImage(1, 1, 11);
    spaced.data.fill(0);
    const set = { firstGid: 1, tileset: tileset(TSX), image: spaced, tileImages: new Map() };
    const x = 1 + 5;
    const y = 1;
    spaced.data.set([9, 8, 7, 255], (y * 11 + x) * 4);
    const plan = planOf(tmjText([2, 0, 0, 0]), [set]);
    expect(Array.from(plan.tiles[1]?.image.data.subarray(0, 4) ?? [])).toEqual([9, 8, 7, 255]);
  });

  it('keeps the first collision shape source on the tile and warns about extras', () => {
    const plan = planOf(TMX, [props(), ground()]);
    expect(plan.tiles[1]?.shapes).toEqual([{ kind: 'rect', x: 0, y: 0, width: 4, height: 2 }]);
    expect(plan.warnings.join(' ')).toContain('object or image layer');
  });

  it('clears the transparent colour of the tileset image', () => {
    const image = sheetImage(2, 2, 4);
    image.data.set([255, 0, 255, 255], 0);
    const plan = planOf(tmjText([1, 0, 0, 0]), [{ ...ground(), image }]);
    expect(Array.from(plan.tiles[0]?.image.data.subarray(0, 4) ?? [])).toEqual([255, 0, 255, 0]);
  });

  it('clears cells that name a tile no tileset has and says so', () => {
    const plan = planOf(tmjText([1, 99, 0, 0]), [ground()]);
    expect(Array.from(plan.layers[0]?.cells ?? [])).toEqual([1, 0, 0, 0]);
    expect(plan.warnings.join(' ')).toContain('not in the tilesets');
  });

  it('refuses tilesets whose tile size differs from the map cells', () => {
    const read = readTiledMap(tmjText([1, 0, 0, 0]));
    if (!read.ok) throw new Error(read.message);
    const wide = { ...ground(), tileset: { ...ground().tileset, tileWidth: 8 } };
    const plan = planTiledImport({ map: read.map, tilesets: [wide] });
    expect(plan.ok).toBe(false);
  });

  it('keeps only the used tiles when a tileset is past the tile limit', () => {
    const big = { ...ground(), image: sheetImage(70, 70, 4) };
    const wide = { ...big, tileset: { ...big.tileset, tileCount: 4900 } };
    const plan = planOf(tmjText([1, 2, 4900, 0]), [wide]);
    expect(plan.tiles.map((tile) => tile.gid)).toEqual([1, 2, 4900]);
  });
});
