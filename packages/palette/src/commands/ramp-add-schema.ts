/* @layer core @kind logic */
import { MAX_BANK_CAP } from '@bxel/document';
import { idSchema } from '@bxel/document/schema';
import { z } from 'zod';
import { MIN_RAMP_SWATCHES } from './ramp-limits.constants';

const rampAddSchema = z.strictObject({
  bankId: idSchema('bnk'),
  name: z.string(),
  swatches: z.array(idSchema('sw')).min(MIN_RAMP_SWATCHES).max(MAX_BANK_CAP),
});

export { rampAddSchema };
