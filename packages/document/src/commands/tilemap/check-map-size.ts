/* @layer core @kind logic */
import type { Size } from '../../model/geometry.type';
import { MAX_MAP_CELLS } from '../../model/tilemap-limits.constants';
import { MAX_MAP_SIDE } from '../../schema/tilemap-schema.constants';
import { ERROR_CODE } from '../error-code.constants';
import { fail } from '../fail';

const inRange = (value: number): boolean => Number.isInteger(value) && value >= 1 && value <= MAX_MAP_SIDE;

const checkMapSize = ({ width, height }: Size): void => {
  if (!inRange(width) || !inRange(height) || width * height > MAX_MAP_CELLS) {
    throw fail(
      ERROR_CODE.SIZE_OUT_OF_RANGE,
      `A tilemap is 1 to ${MAX_MAP_SIDE} cells on each side and at most ${MAX_MAP_CELLS} cells in all.`,
    );
  }
};

export { checkMapSize };
