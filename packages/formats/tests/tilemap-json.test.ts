/* @layer tests @kind test */
import { FORMAT_ERROR_CODE, writeTilemapJson } from '@bxel/formats';
import { describe, expect, it } from 'vitest';
import { jsonText, makeMapInput, parseMap } from './make-tilemap-input';

const FLIP_X = 0x80000000;
const FLIP_Y = 0x40000000;
const DIAGONAL = 0x20000000;

const cells = [5, (FLIP_X | 9) >>> 0, 0, (FLIP_Y | DIAGONAL | 12) >>> 0];

describe('writeTilemapJson', () => {
  it('writes the grid, the tile size and the tileset', () => {
    const json = parseMap(writeTilemapJson(makeMapInput(cells)));
    expect(json).toMatchObject({
      format: 'bxel-tilemap',
      version: 1,
      name: 'level',
      size: { columns: 2, rows: 2 },
      tileSize: { w: 2, h: 2 },
      flagBits: { flipX: 1, flipY: 2, diagonal: 4 },
      tileset: { name: 'ground', image: 'ground.png', size: { w: 4, h: 4 }, columns: 2 },
    });
    expect(json.tileset.tiles).toEqual([
      { key: 5, x: 0, y: 0 },
      { key: 9, x: 2, y: 0 },
      { key: 12, x: 0, y: 2 },
    ]);
  });

  it('writes layers as key and flag arrays', () => {
    const json = parseMap(writeTilemapJson(makeMapInput(cells)));
    expect(json.layers[0]).toEqual({ name: 'Ground', visible: true, locked: false, keys: [5, 9, 0, 12], flags: [0, 1, 0, 6] });
    expect(json.layers[1]).toMatchObject({ name: 'Top', visible: false, locked: true, keys: [0, 0, 0, 0] });
  });

  it('keeps each layer on one line and is deterministic', () => {
    const text = jsonText(writeTilemapJson(makeMapInput(cells)));
    expect(text.split('\n').filter((line) => line.includes('"keys"'))).toHaveLength(2);
    expect(jsonText(writeTilemapJson(makeMapInput(cells)))).toBe(text);
  });
});

describe('writeTilemapJson refusals', () => {
  it('blocks a cell whose key has no tile', () => {
    const result = writeTilemapJson(makeMapInput([5, 7, 0, 0]));
    expect(result).toMatchObject({ ok: false, code: FORMAT_ERROR_CODE.TILEMAP_BROKEN_REFERENCE });
    expect(!result.ok && result.message).toContain('key 7');
    expect(!result.ok && result.message).toContain('(1, 0)');
  });

  it('blocks a broken key that carries flip flags', () => {
    const result = writeTilemapJson(makeMapInput([0, 0, 0, (FLIP_X | 6) >>> 0]));
    expect(result).toMatchObject({ ok: false, code: FORMAT_ERROR_CODE.TILEMAP_BROKEN_REFERENCE });
  });

  it('rejects a layer of the wrong length, a reserved bit and a map without layers', () => {
    const input = makeMapInput(cells);
    const short = { ...input, layers: [{ name: 'Ground', visible: true, locked: false, cells: new Uint32Array(3) }] };
    const code = FORMAT_ERROR_CODE.TILEMAP_INVALID_INPUT;
    expect(writeTilemapJson(short)).toMatchObject({ ok: false, code });
    expect(writeTilemapJson(makeMapInput([0x10000005, 0, 0, 0]))).toMatchObject({ ok: false, code });
    expect(writeTilemapJson({ ...input, layers: [] })).toMatchObject({ ok: false, code });
  });
});
