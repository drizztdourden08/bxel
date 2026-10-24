/* @layer tests @kind test */
import { FORMAT_ERROR_CODE, writeTiledJson } from '@bxel/formats';
import { describe, expect, it } from 'vitest';
import { makeMapInput, parseTiled } from './make-tilemap-input';

const FLIP_X = 0x80000000;
const FLIP_Y = 0x40000000;
const DIAGONAL = 0x20000000;

const cells = [5, (FLIP_X | 9) >>> 0, 0, (FLIP_Y | DIAGONAL | 12) >>> 0];

describe('writeTiledJson map and tileset', () => {
  it('writes an orthogonal Tiled map', () => {
    const map = parseTiled(writeTiledJson(makeMapInput(cells)));
    expect(map).toMatchObject({
      type: 'map',
      orientation: 'orthogonal',
      renderorder: 'right-down',
      infinite: false,
      width: 2,
      height: 2,
      tilewidth: 2,
      tileheight: 2,
      nextlayerid: 3,
    });
  });

  it('embeds one tileset entry that matches the packed image', () => {
    const map = parseTiled(writeTiledJson(makeMapInput(cells)));
    expect(map.tilesets).toEqual([
      {
        firstgid: 1,
        name: 'ground',
        image: 'ground.png',
        imagewidth: 4,
        imageheight: 4,
        tilewidth: 2,
        tileheight: 2,
        tilecount: 3,
        columns: 2,
        spacing: 0,
        margin: 0,
      },
    ]);
  });
});

describe('writeTiledJson layers and gids', () => {
  it('sets the Tiled flip bits on the gid', () => {
    const [ground, top] = parseTiled(writeTiledJson(makeMapInput(cells))).layers;
    expect(ground).toMatchObject({ id: 1, name: 'Ground', type: 'tilelayer', visible: true, width: 2, height: 2, opacity: 1 });
    expect(ground?.data).toEqual([1, 0x80000002, 0, (FLIP_Y | DIAGONAL | 3) >>> 0]);
    expect(top).toMatchObject({ id: 2, name: 'Top', visible: false, locked: true });
    expect(top?.data).toEqual([0, 0, 0, 0]);
  });

  it('numbers the gids by position, not by key, when keys are not contiguous', () => {
    const map = parseTiled(writeTiledJson(makeMapInput([40, 0, 0, 7], [40, 7])));
    expect(map.layers[0]?.data).toEqual([1, 0, 0, 2]);
  });

  it('honours spacing and margin when it derives the tile ids', () => {
    const input = makeMapInput([0, 0, 0, 0]);
    const tiles = [
      { key: 5, x: 1, y: 1 },
      { key: 9, x: 4, y: 1 },
      { key: 12, x: 1, y: 4 },
    ];
    const spaced = {
      ...input,
      tileset: { ...input.tileset, margin: 1, spacing: 1, tiles },
      layers: [{ name: 'Ground', visible: true, locked: false, cells: Uint32Array.from([12, 9, 5, 0]) }],
    };
    expect(parseTiled(writeTiledJson(spaced)).layers[0]?.data).toEqual([3, 2, 1, 0]);
  });

  it('is blocked by a broken reference as well', () => {
    expect(writeTiledJson(makeMapInput([5, 99, 0, 0]))).toMatchObject({
      ok: false,
      code: FORMAT_ERROR_CODE.TILEMAP_BROKEN_REFERENCE,
    });
  });
});
