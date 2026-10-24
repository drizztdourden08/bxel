/* @layer core @kind constants */
import type { AreaRule } from '../model/preset.type';

const AREA_TILE_8: AreaRule = {
  width: 8,
  height: 8,
  scope: 'tile',
  kind: 'onePalettePerArea',
  limit: 1,
  tier: 'warn',
};

const AREA_ATTRIBUTE_16: AreaRule = {
  width: 16,
  height: 16,
  scope: 'tile',
  kind: 'onePalettePerArea',
  limit: 1,
  tier: 'warn',
};

export { AREA_ATTRIBUTE_16, AREA_TILE_8 };
