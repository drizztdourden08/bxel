/* @layer core @kind logic */
import { z } from 'zod';
import { tilemapRefSchema } from './tilemap-ref-schema';

const tilemapUpdateSchema = z.strictObject({
  tilemap: tilemapRefSchema,
  name: z.string(),
});

export { tilemapUpdateSchema };
