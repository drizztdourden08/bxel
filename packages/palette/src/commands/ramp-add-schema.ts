/* @layer core @kind logic */
import { idSchema } from '@bxel/document/schema';
import { z } from 'zod';
import { rampSwatchSchema } from './ramp-swatch-schema';

const rampAddSchema = z.strictObject({
  bankId: idSchema('bnk'),
  name: z.string(),
  swatches: rampSwatchSchema,
});

export { rampAddSchema };
