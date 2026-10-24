/* @layer core @kind logic */
import { z } from 'zod';
import { pointSchema } from './point-schema';
import { tilemapRefSchema } from './tilemap-ref-schema';

const tilemapResizeSchema = z.strictObject({
  tilemap: tilemapRefSchema,
  columns: z.number().int(),
  rows: z.number().int(),
  offset: pointSchema.optional(),
});

export { tilemapResizeSchema };
