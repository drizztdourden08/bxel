/* @layer core @kind constants */
import { ALPHA_THRESHOLD_DEFAULT } from '../alpha-threshold.constants';
import type { BayerSize } from '../palette-map.type';

const DITHER_NAMES = ['none', 'bayer2', 'bayer4', 'bayer8'] as const;

const DITHER_SIZE: Readonly<Record<(typeof DITHER_NAMES)[number], BayerSize | null>> = {
  none: null,
  bayer2: 2,
  bayer4: 4,
  bayer8: 8,
};

const IMPORT_MAPPING_DEFAULT = {
  dither: 'none',
  originX: 0,
  originY: 0,
  alphaThreshold: ALPHA_THRESHOLD_DEFAULT,
} as const;

export { DITHER_NAMES, DITHER_SIZE, IMPORT_MAPPING_DEFAULT };
