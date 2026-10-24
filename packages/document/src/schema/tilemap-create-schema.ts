/* @layer core @kind logic */
import { z } from 'zod';
import { orientRequestSchema } from './orient-request-schema';
import { tilesetRefSchema } from './tileset-ref-schema';

const tilemapCreateSchema = z.strictObject({
  name: z.string(),
  tileset: tilesetRefSchema,
  columns: z.number().int(),
  rows: z.number().int(),
  layerName: z.string().optional(),
  orientation: orientRequestSchema.optional(),
});

export { tilemapCreateSchema };
