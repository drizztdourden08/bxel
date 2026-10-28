/* @layer core @kind logic */
import { idSchema } from '@bxel/document/schema';
import { z } from 'zod';
import { rampSwatchSchema } from './ramp-swatch-schema';

const rampUpdateSchema = z.strictObject({
  bankId: idSchema('bnk'),
  rampId: idSchema('rmp'),
  name: z.string().optional(),
  swatches: rampSwatchSchema.optional(),
});

export { rampUpdateSchema };
