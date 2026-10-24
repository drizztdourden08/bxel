/* @layer core @kind logic */
import { z } from 'zod';
import { idSchema } from './id-schema';

const tilesetCreateSchema = z.strictObject({
  name: z.string(),
  tileWidth: z.number().int(),
  tileHeight: z.number().int(),
  bankId: idSchema('bnk').optional(),
});

export { tilesetCreateSchema };
