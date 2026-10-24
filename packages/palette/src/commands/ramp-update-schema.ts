/* @layer core @kind logic */
import { MAX_BANK_CAP } from '@bxel/document';
import { idSchema } from '@bxel/document/schema';
import { z } from 'zod';
import { MIN_RAMP_SWATCHES } from './ramp-limits.constants';

const rampUpdateSchema = z.strictObject({
  bankId: idSchema('bnk'),
  rampId: idSchema('rmp'),
  name: z.string().optional(),
  swatches: z.array(idSchema('sw')).min(MIN_RAMP_SWATCHES).max(MAX_BANK_CAP).optional(),
});

export { rampUpdateSchema };
