/* @layer core @kind logic */
import { idSchema } from '@bxel/document/schema';
import { z } from 'zod';

const rampMoveSchema = z.strictObject({
  bankId: idSchema('bnk'),
  rampId: idSchema('rmp'),
  toIndex: z.number().int().min(0),
});

export { rampMoveSchema };
