/* @layer core @kind logic */
import { z } from 'zod';
import { collisionSchema } from './collision-schema';
import { tileKeySchema } from './tile-key-schema';
import { tilesetRefSchema } from './tileset-ref-schema';

const tileCollisionSchema = z.strictObject({
  tileset: tilesetRefSchema,
  key: tileKeySchema.min(1),
  shape: z.union([collisionSchema, z.strictObject({ kind: z.literal('none') })]),
});

export { tileCollisionSchema };
