/* @layer core @kind logic */
import { idSchema } from '@bxel/document/schema';
import { z } from 'zod';

const paletteDuplicateSchema = z.strictObject({
  bankId: idSchema('bnk'),
  name: z.string().optional(),
});

export { paletteDuplicateSchema };
