/* @layer core @kind logic */
import { MAX_BANK_CAP } from '@bxel/document';
import { idSchema } from '@bxel/document/schema';
import { z } from 'zod';
import { MIN_RAMP_SWATCHES } from './ramp-limits.constants';

const rampSwatchSchema = z
  .array(z.union([idSchema('sw'), z.strictObject({ ref: z.string().min(1) })]))
  .min(MIN_RAMP_SWATCHES)
  .max(MAX_BANK_CAP);

export { rampSwatchSchema };
