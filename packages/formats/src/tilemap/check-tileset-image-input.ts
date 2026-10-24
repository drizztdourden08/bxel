/* @layer core @kind logic */
import { FORMAT_ERROR_CODE } from '../failure/format-error.constants';
import { formatFail } from '../failure/format-fail';
import type { FormatFailure } from '../failure/format.type';
import { isCount } from '../sheet/is-count';
import { isSize } from '../sheet/is-size';
import type { TilesetImageInput, TilesetTile } from './tilemap.type';

const bad = (message: string): FormatFailure => formatFail(FORMAT_ERROR_CODE.TILEMAP_INVALID_INPUT, message);

const checkTile = (input: TilesetImageInput, tile: TilesetTile, keys: ReadonlySet<number>): FormatFailure | undefined => {
  const { width, height, data } = tile.image;
  if (!Number.isInteger(tile.key) || tile.key < 1 || keys.has(tile.key)) {
    return bad(`Tile key ${tile.key} is not a unique key >= 1`);
  }
  const fits = width === input.tileWidth && height === input.tileHeight && data.length === width * height * 4;
  return fits ? undefined : bad(`Tile ${tile.key} is not a ${input.tileWidth} x ${input.tileHeight} RGBA image`);
};

const checkTilesetImageInput = (input: TilesetImageInput): FormatFailure | undefined => {
  if (![input.tileWidth, input.tileHeight, input.columns].every(isSize)) {
    return bad('The tile size and the column count must be integers >= 1');
  }
  if (!isCount(input.spacing) || !isCount(input.margin)) return bad('Spacing and margin must be integers >= 0');
  if (input.tiles.length < 1) return bad('A tileset image needs at least one tile');
  const keys = new Set<number>();
  for (const tile of input.tiles) {
    const problem = checkTile(input, tile, keys);
    if (problem) return problem;
    keys.add(tile.key);
  }
  return undefined;
};

export { checkTilesetImageInput };
