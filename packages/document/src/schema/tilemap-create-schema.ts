/* @layer core @kind logic */
import { z } from 'zod';
import { tilesetRefSchema } from './tileset-ref-schema';

const tilemapCreateSchema = z.strictObject({
  name: z.string(),
  tileset: tilesetRefSchema,
  columns: z.number().int(),
  rows: z.number().int(),
  layerName: z.string().optional(),
});

export { tilemapCreateSchema };
