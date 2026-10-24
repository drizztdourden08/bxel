/* @layer core @kind logic */
import { idSchema } from '@bxel/document/schema';
import { z } from 'zod';

const rampDeleteSchema = z.strictObject({
  bankId: idSchema('bnk'),
  rampId: idSchema('rmp'),
});

export { rampDeleteSchema };
