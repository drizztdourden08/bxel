/* @layer core @kind logic */
import { z } from 'zod';
import { mapLayerRefSchema } from './map-layer-ref-schema';
import { tilemapRefSchema } from './tilemap-ref-schema';

const MAX_GROUPED = 256;

const mapLayerGroupSchema = z.strictObject({
  tilemap: tilemapRefSchema,
  layers: z.array(mapLayerRefSchema).min(1).max(MAX_GROUPED),
  name: z.string().optional(),
});

export { mapLayerGroupSchema };
