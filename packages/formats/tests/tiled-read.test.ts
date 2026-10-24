/* @layer tests @kind test */
import { readTiledMap, readTiledTileset } from '@bxel/formats';
import type { TiledMap, TiledTileset } from '@bxel/formats';
import { describe, expect, it } from 'vitest';
import { TMX, TSX, base64Of, gidBytes, tmjText, zlibLayer } from './tiled-fixtures';

const mapOf = (text: string): TiledMap => {
  const result = readTiledMap(text);
  if (!result.ok) throw new Error(result.message);
  return result.map;
};

const tilesetOf = (text: string): TiledTileset => {
  const result = readTiledTileset(text);
  if (!result.ok) throw new Error(result.message);
  return result.tileset;
};

describe('readTiledMap TMX', () => {
  it('reads the map header, tileset references and flattened layers', () => {
    const map = mapOf(TMX);
    expect(map).toMatchObject({ orientation: 'orthogonal', width: 3, height: 2, tileWidth: 4, tileHeight: 4, skippedLayers: 1 });
    expect(map.tilesets.map((set) => [set.firstGid, set.source, set.embedded?.name ?? null])).toEqual([
      [1, 'ground.tsx', null],
      [5, null, 'props'],
    ]);
    expect(map.layers.map((layer) => [layer.name, layer.visible])).toEqual([
      ['Ground', true],
      ['Over/Top', false],
    ]);
    expect(Array.from(map.layers[0]?.gids ?? [])).toEqual([1, 2, 3, 4, 5, 6]);
    expect(Array.from(map.layers[1]?.gids ?? [])[1]).toBe(0x80000001);
  });
});

describe('readTiledTileset TSX', () => {
  it('reads the image, spacing, margin and the tile collision shapes', () => {
    const tileset = tilesetOf(TSX);
    expect(tileset).toMatchObject({ name: 'ground', tileWidth: 4, spacing: 1, margin: 1, columns: 2, tileCount: 4 });
    expect(tileset.image).toEqual({ source: 'ground.png', width: 11, height: 11, transparent: 'ff00ff' });
    expect(tileset.tiles[0]?.shapes).toEqual([{ kind: 'rect', x: 0, y: 0, width: 4, height: 2 }]);
    expect(tileset.tiles[0]?.properties).toEqual({ solid: true });
  });
});

describe('readTiledMap JSON', () => {
  it('reads plain, base64 and zlib layer data', () => {
    const gids = [1, 0, 0x40000002, 3];
    expect(Array.from(mapOf(tmjText(gids)).layers[0]?.gids ?? [])).toEqual([1, 0, 0x40000002, 3]);
    expect(Array.from(mapOf(tmjText(base64Of(gidBytes(gids)), { encoding: 'base64' })).layers[0]?.gids ?? [])).toEqual(gids);
    const zipped = tmjText(zlibLayer(gids), { encoding: 'base64', compression: 'zlib' });
    expect(Array.from(mapOf(zipped).layers[0]?.gids ?? [])).toEqual(gids);
  });

  it('reads polygon shapes with their object origin', () => {
    const text = JSON.stringify({
      name: 't',
      tilewidth: 4,
      tileheight: 4,
      tilecount: 1,
      columns: 1,
      image: 't.png',
      imagewidth: 4,
      imageheight: 4,
      tiles: [{ id: 0, objectgroup: { objects: [{ x: 1, y: 1, polygon: [{ x: 0, y: 0 }, { x: 2, y: 0 }, { x: 0, y: 2 }] }] } }],
    });
    expect(tilesetOf(text).tiles[0]?.shapes).toEqual([
      { kind: 'polygon', points: [{ x: 1, y: 1 }, { x: 3, y: 1 }, { x: 1, y: 3 }] },
    ]);
  });

  it('refuses what it cannot read, with a reason', () => {
    expect(readTiledMap('not tiled').ok).toBe(false);
    expect(readTiledMap('{broken').ok).toBe(false);
    expect(readTiledMap(tmjText([1, 2, 3])).ok).toBe(false);
    expect(readTiledMap(tmjText('AAAA', { encoding: 'base64', compression: 'zstd' })).ok).toBe(false);
    expect(readTiledMap(tmjText([1, 0, 0, 0], {}).replace('"infinite":false', '"infinite":true')).ok).toBe(false);
    expect(readTiledMap(tmjText([1, 0, 0, 0]).replace('"width":2,"height":2,"tilewidth"', '"width":0,"height":2,"tilewidth"')).ok).toBe(false);
  });
});
