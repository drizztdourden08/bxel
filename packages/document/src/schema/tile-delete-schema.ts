/* @layer core @kind logic */
import { z } from 'zod';
import { tileKeySchema } from './tile-key-schema';
import { tilesetRefSchema } from './tileset-ref-schema';

const tileDeleteSchema = z.strictObject({
  tileset: tilesetRefSchema,
  key: tileKeySchema.min(1),
  replacement: tileKeySchema.optional(),
});

export { tileDeleteSchema };
