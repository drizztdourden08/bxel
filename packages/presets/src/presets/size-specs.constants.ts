/* @layer core @kind constants */
import type { SizeSpec } from '../model/preset.type';
import { SIZES_TILE_STEPS } from './sprite-sizes.constants';

const SIZE_SPEC_TILE_SET: SizeSpec = {
  tile: [8, 8],
  sprites: SIZES_TILE_STEPS,
  canvasDefault: [8, 8],
};

export { SIZE_SPEC_TILE_SET };
