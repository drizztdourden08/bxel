/* @layer core @kind logic */
import { z } from 'zod';
import { tilemapRefSchema } from './tilemap-ref-schema';

const tilemapDuplicateSchema = z.strictObject({
  tilemap: tilemapRefSchema,
  name: z.string().optional(),
});

export { tilemapDuplicateSchema };
