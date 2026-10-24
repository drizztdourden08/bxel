/* @layer core @kind logic */
import type { AreaBank, AreaClash } from '../model/area.type';
import type { AreaRule, PlatformPreset } from '../model/preset.type';
import type { SpriteSize } from '../model/sprite-size.type';
import { AREA_CLASH_CODE } from '../results/preset-error.constants';
import { presetOk } from '../results/preset-ok';
import type { PresetResult } from '../results/preset-result.type';
import { areaKey } from './area-key';
import { areaRects } from './area-rects';
import { areaUsage } from './area-usage';
import { checkBuffer } from './check-buffer';

const clashesOf = (
  preset: PlatformPreset,
  buffer: ArrayLike<number>,
  size: SpriteSize,
  rule: AreaRule,
): AreaClash[] => {
  const keyOf = areaKey(preset, rule);
  const code =
    rule.kind === 'onePalettePerArea' ? AREA_CLASH_CODE.PALETTE_CLASH : AREA_CLASH_CODE.COLOUR_LIMIT;
  return areaRects(size, rule).flatMap((rect) => {
    const used = areaUsage(buffer, size.width, rect, keyOf);
    return used > rule.limit ? [{ ...rect, code, used, limit: rule.limit, tier: rule.tier }] : [];
  });
};

const checkAreas = (
  preset: PlatformPreset,
  indexBuffer: ArrayLike<number>,
  size: SpriteSize,
  bank: AreaBank,
): PresetResult<readonly AreaClash[]> => {
  const failure = checkBuffer(indexBuffer, size, bank);
  if (failure !== null) return failure;
  return presetOk(preset.areaRules.flatMap((rule) => clashesOf(preset, indexBuffer, size, rule)));
};

export { checkAreas };
