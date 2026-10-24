/* @layer core @kind logic */
import type { AreaBank } from '../model/area.type';
import type { SpriteSize } from '../model/sprite-size.type';
import { PRESET_ERROR_CODE } from '../results/preset-error.constants';
import { presetFail } from '../results/preset-fail';
import type { PresetFailure } from '../results/preset-result.type';
import { isPositiveInteger } from './is-positive-integer';

const checkBuffer = (
  buffer: ArrayLike<number>,
  size: SpriteSize,
  bank: AreaBank,
): PresetFailure | null => {
  const { width, height } = size;
  if (!isPositiveInteger(width) || !isPositiveInteger(height)) {
    return presetFail(PRESET_ERROR_CODE.SIZE_INVALID, 'A size needs whole numbers above zero');
  }
  if (buffer.length !== width * height) {
    return presetFail(PRESET_ERROR_CODE.BUFFER_MISMATCH, 'The buffer does not match the size');
  }
  const bad = Array.from(buffer).findIndex(
    (value) => !Number.isInteger(value) || value < 0 || value >= bank.cap,
  );
  if (bad < 0) return null;
  return presetFail(PRESET_ERROR_CODE.INDEX_INVALID, 'A pixel index is outside the bank', [
    String(bad),
  ]);
};

export { checkBuffer };
