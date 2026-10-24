/* @layer core @kind logic */
import { idSchema } from '@bxel/document/schema';
import { z } from 'zod';

const swatchMergeSchema = z.strictObject({
  bankId: idSchema('bnk'),
  from: idSchema('sw'),
  into: idSchema('sw'),
});

export { swatchMergeSchema };
