/* @layer core @kind logic */
import { z } from 'zod';
import { tilesetRefSchema } from './tileset-ref-schema';

const tilesetDuplicateSchema = z.strictObject({
  tileset: tilesetRefSchema,
  name: z.string().optional(),
});

export { tilesetDuplicateSchema };
