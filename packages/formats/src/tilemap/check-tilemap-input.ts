/* @layer core @kind logic */
import { FORMAT_ERROR_CODE } from '../failure/format-error.constants';
import { formatFail } from '../failure/format-fail';
import type { FormatFailure } from '../failure/format.type';
import { isSize } from '../sheet/is-size';
import { findBrokenCell } from './find-broken-cell';
import type { TilemapExportInput } from './tilemap.type';

const bad = (message: string): FormatFailure => formatFail(FORMAT_ERROR_CODE.TILEMAP_INVALID_INPUT, message);

const checkTilemapInput = (input: TilemapExportInput): FormatFailure | undefined => {
  if (![input.columns, input.rows, input.tileWidth, input.tileHeight].every(isSize)) {
    return bad('The map and tile sizes must be integers >= 1');
  }
  if (input.layers.length < 1) return bad('A tilemap needs at least one layer');
  const wrong = input.layers.find((layer) => layer.cells.length !== input.columns * input.rows);
  if (wrong) return bad(`Layer ${wrong.name} does not hold ${input.columns} x ${input.rows} cells`);
  const keys = new Set(input.tileset.tiles.map((tile) => tile.key));
  const missing = (input.tileset.animations ?? []).find(
    (animation) => !keys.has(animation.key) || animation.frames.length < 1 || animation.frames.some((frame) => !keys.has(frame.key)),
  );
  if (missing) return bad(`The animation of tile key ${missing.key} names a tile the tileset does not have`);
  const broken = findBrokenCell(input, keys);
  if (!broken) return undefined;
  const code = broken.reserved ? FORMAT_ERROR_CODE.TILEMAP_INVALID_INPUT : FORMAT_ERROR_CODE.TILEMAP_BROKEN_REFERENCE;
  const why = broken.reserved ? 'sets a reserved bit' : `names tile key ${broken.key}, which the tileset does not have`;
  return formatFail(code, `Layer ${broken.layer} cell (${broken.x}, ${broken.y}) ${why}`);
};

export { checkTilemapInput };
