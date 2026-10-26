/* @layer tests @kind test */
import { FORMAT_ERROR_CODE, writeTiledJson, writeTilemapJson } from '@bxel/formats';
import type { TilemapExportInput } from '@bxel/formats';
import { describe, expect, it } from 'vitest';
import { makeMapInput, parseMap, parseTiled } from './make-tilemap-input';

const CELLS = [5, 9, 0, 12];

const animated = (start: 'together' | 'random' = 'together'): TilemapExportInput => {
  const input = makeMapInput(CELLS, [5, 9, 12, 13, 14, 15]);
  return {
    ...input,
    tileset: {
      ...input.tileset,
      animations: [
        {
          key: 9,
          start,
          frames: [
            { key: 13, durationMs: 200 },
            { key: 14, durationMs: 300 },
            { key: 15, durationMs: 200 },
            { key: 14, durationMs: 300 },
          ],
        },
      ],
    },
  };
};

describe('Tiled animated tiles', () => {
  it('keeps the gids of the normal tiles and appends the frames after them', () => {
    const plain = parseTiled(writeTiledJson(makeMapInput(CELLS)));
    const water = parseTiled(writeTiledJson(animated()));
    expect(water.layers[0]?.data).toEqual(plain.layers[0]?.data);
    expect(water.tilesets[0]).toMatchObject({ tilecount: 6, columns: 2 });
  });

  it('writes the frames as tile ids with their durations', () => {
    const water = parseTiled(writeTiledJson(animated()));
    const tiles = water.tilesets[0]?.['tiles'];
    expect(tiles).toEqual([
      {
        id: 1,
        animation: [
          { tileid: 3, duration: 200 },
          { tileid: 4, duration: 300 },
          { tileid: 5, duration: 200 },
          { tileid: 4, duration: 300 },
        ],
      },
    ]);
  });

  it('marks a random start as a Bxel property that Tiled ignores', () => {
    const water = parseTiled(writeTiledJson(animated('random')));
    const tiles = water.tilesets[0]?.['tiles'] as readonly { properties?: unknown }[];
    expect(tiles[0]?.properties).toEqual([{ name: 'bxelStart', type: 'string', value: 'random' }]);
  });

  it('keeps the start in the Bxel map JSON', () => {
    const map = parseMap(writeTilemapJson(animated('random')));
    expect(map.tileset).toMatchObject({ animations: [{ key: 9, start: 'random' }] });
  });

  it('refuses an animation that names a missing tile', () => {
    const input = animated();
    const broken = { ...input, tileset: { ...input.tileset, animations: [{ key: 9, start: 'together' as const, frames: [{ key: 99, durationMs: 100 }] }] } };
    expect(writeTiledJson(broken)).toMatchObject({ ok: false, code: FORMAT_ERROR_CODE.TILEMAP_INVALID_INPUT });
  });
});
