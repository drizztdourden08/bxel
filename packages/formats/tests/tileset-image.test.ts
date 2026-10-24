/* @layer tests @kind test */
import { decodePng, exportTilesetImage, FORMAT_ERROR_CODE } from '@bxel/formats';
import { describe, expect, it } from 'vitest';
import { makeTiles, mustImage } from './make-tilemap-input';

const base = { tileWidth: 2, tileHeight: 2, columns: 2, spacing: 0, margin: 0 };

describe('exportTilesetImage', () => {
  it('packs the tiles in a grid in the order given', () => {
    const result = mustImage({ ...base, columns: 3, tiles: makeTiles([5, 9, 12, 20]) });
    expect([result.image.width, result.image.height]).toEqual([6, 4]);
    expect([result.columns, result.rows]).toEqual([3, 2]);
    expect(result.tiles).toEqual([
      { key: 5, x: 0, y: 0 },
      { key: 9, x: 2, y: 0 },
      { key: 12, x: 4, y: 0 },
      { key: 20, x: 0, y: 2 },
    ]);
  });

  it('copies each tile into its cell', () => {
    const result = mustImage({ ...base, tiles: makeTiles([5, 9, 12]) });
    const pixel = (x: number, y: number) => Array.from(result.image.data.subarray((y * result.image.width + x) * 4, (y * result.image.width + x) * 4 + 4));
    expect(pixel(0, 0)).toEqual([50, 25, 0, 255]);
    expect(pixel(3, 1)).toEqual([90, 45, 3, 255]);
    expect(pixel(1, 3)).toEqual([120, 60, 3, 255]);
    expect(pixel(2, 2)).toEqual([0, 0, 0, 0]);
  });

  it('keeps spacing and margin and clamps the columns to the tile count', () => {
    const result = mustImage({ ...base, columns: 8, spacing: 1, margin: 2, tiles: makeTiles([1, 2, 3]) });
    expect(result.columns).toBe(3);
    expect([result.image.width, result.image.height]).toEqual([2 * 2 + 3 * 2 + 2, 2 * 2 + 2]);
    expect(result.tiles.map((tile) => [tile.x, tile.y])).toEqual([[2, 2], [5, 2], [8, 2]]);
  });

  it('writes a PNG that decodes to the same pixels', () => {
    const result = mustImage({ ...base, tiles: makeTiles([5, 9, 12]) });
    const decoded = decodePng(result.png);
    expect(decoded.ok).toBe(true);
    if (!decoded.ok) return;
    expect([decoded.width, decoded.height]).toEqual([result.image.width, result.image.height]);
    expect(Array.from(decoded.data)).toEqual(Array.from(result.image.data));
  });

  it('rejects empty input, a wrong tile size and a repeated key', () => {
    const code = FORMAT_ERROR_CODE.TILEMAP_INVALID_INPUT;
    expect(exportTilesetImage({ ...base, tiles: [] })).toMatchObject({ ok: false, code });
    expect(exportTilesetImage({ ...base, tileWidth: 3, tiles: makeTiles([1]) })).toMatchObject({ ok: false, code });
    expect(exportTilesetImage({ ...base, tiles: makeTiles([1, 1]) })).toMatchObject({ ok: false, code });
    expect(exportTilesetImage({ ...base, tiles: makeTiles([0]) })).toMatchObject({ ok: false, code });
    expect(exportTilesetImage({ ...base, spacing: -1, tiles: makeTiles([1]) })).toMatchObject({ ok: false, code });
  });
});
