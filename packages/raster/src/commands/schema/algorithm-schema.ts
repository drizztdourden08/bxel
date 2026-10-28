/* @layer core @kind logic */
import { z } from 'zod';
import { ROTATE_ALGORITHMS, SCALE_ALGORITHMS } from '../../resample/resample.constants';

const ALGORITHM_HELP = 'Resampling method. Every method keeps to the colours already in the region, so the palette never grows.';

const rotateAlgorithmSchema = z.enum(ROTATE_ALGORITHMS).default('nearest').describe(ALGORITHM_HELP);

const scaleAlgorithmSchema = z.enum(SCALE_ALGORITHMS).default('nearest').describe(ALGORITHM_HELP);

const similarSchema = z
  .number()
  .min(0)
  .max(255)
  .default(0)
  .describe('RotSprite only: colours closer than this palette distance count as equal. 0 means exactly equal.');

export { rotateAlgorithmSchema, scaleAlgorithmSchema, similarSchema };
