/* @layer core @kind logic */
import { z } from 'zod';
import { MAX_TILE_PROBABILITY } from '../model/tilemap-limits.constants';
import { TERRAIN_KINDS } from '../terrain/terrain.constants';
import { tileKeySchema } from './tile-key-schema';

const variantSchema = z.strictObject({
  key: tileKeySchema.min(1),
  weight: z.number().min(0).max(MAX_TILE_PROBABILITY),
  flipX: z.boolean().optional(),
  flipY: z.boolean().optional(),
  diagonal: z.boolean().optional(),
});

const terrainSetSchema = z.strictObject({
  id: z.string().min(1).max(32),
  name: z.string().min(1).max(48),
  kind: z.enum(TERRAIN_KINDS),
  slots: z.array(z.array(variantSchema).max(16)).max(47),
});

export { terrainSetSchema };
