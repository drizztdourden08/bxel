/* @layer core @kind logic */
import { FORMAT_ERROR_CODE } from '../failure/format-error.constants';
import { formatFail } from '../failure/format-fail';
import type { FormatFailure } from '../failure/format.type';
import { boolOf } from './bool-of';
import { numberOf } from './number-of';
import type { Rec } from './rec.type';
import { TILED_LIMITS, TILED_ORIENTATIONS } from './tiled.constants';
import type { MapShape } from './read-map-shape.type';

const sideOf = (value: unknown): number => {
  const side = numberOf(value, 0);
  return Number.isInteger(side) && side >= 1 && side <= TILED_LIMITS.MAX_SIDE ? side : 0;
};

const readMapShape = (record: Rec): MapShape | FormatFailure => {
  const orientation = TILED_ORIENTATIONS.find((each) => each === record['orientation']);
  const width = sideOf(record['width']);
  const height = sideOf(record['height']);
  const tileWidth = sideOf(record['tilewidth']);
  const tileHeight = sideOf(record['tileheight']);
  if (!orientation || width === 0 || height === 0 || tileWidth === 0 || tileHeight === 0) {
    return formatFail(FORMAT_ERROR_CODE.TILED_INVALID, 'This is not a Tiled map: the size or orientation is missing.');
  }
  if (boolOf(record['infinite'], false)) {
    return formatFail(FORMAT_ERROR_CODE.TILED_UNSUPPORTED, 'Infinite Tiled maps are not supported. Use a fixed size map.');
  }
  if (width * height > TILED_LIMITS.MAX_CELLS) return formatFail(FORMAT_ERROR_CODE.TILED_UNSUPPORTED, 'The map has too many cells.');
  return { orientation, width, height, tileWidth, tileHeight };
};

export { readMapShape };
