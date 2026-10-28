/* @layer core @kind logic */
import { z } from 'zod';
import { mapLayerRefSchema } from './map-layer-ref-schema';
import { tilemapRefSchema } from './tilemap-ref-schema';

const mapLayerMergeSchema = z.strictObject({
  tilemap: tilemapRefSchema,
  layer: mapLayerRefSchema,
  allowLocked: z.boolean().optional(),
});

export { mapLayerMergeSchema };
