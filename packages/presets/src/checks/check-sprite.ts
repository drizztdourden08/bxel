/* @layer core @kind logic */
import type { PlatformPreset } from '../model/preset.type';
import type { SpriteSize } from '../model/sprite-size.type';
import { PRESET_ERROR_CODE } from '../results/preset-error.constants';
import { presetFail } from '../results/preset-fail';
import { presetOk } from '../results/preset-ok';
import type { PresetResult } from '../results/preset-result.type';
import { describeSizes } from './describe-sizes';
import { isPositiveInteger } from './is-positive-integer';
import { sizeAllowed } from './size-allowed';

const checkSprite = (preset: PlatformPreset, size: SpriteSize): PresetResult<SpriteSize> => {
  const { width, height } = size;
  if (!isPositiveInteger(width) || !isPositiveInteger(height)) {
    return presetFail(PRESET_ERROR_CODE.SIZE_INVALID, 'A size needs whole numbers above zero');
  }
  if (sizeAllowed(preset.sizes.sprites, width, height)) return presetOk(size);
  return presetFail(
    PRESET_ERROR_CODE.SIZE_NOT_ALLOWED,
    `${String(width)}x${String(height)} is not an allowed size for ${preset.name}`,
    describeSizes(preset.sizes.sprites),
  );
};

export { checkSprite };
