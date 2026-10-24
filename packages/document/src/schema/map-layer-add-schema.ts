/* @layer core @kind logic */
import { z } from 'zod';
import { mapLayerRefSchema } from './map-layer-ref-schema';
import { tilemapRefSchema } from './tilemap-ref-schema';

const mapLayerAddSchema = z.strictObject({
  tilemap: tilemapRefSchema,
  name: z.string().optional(),
  above: mapLayerRefSchema.optional(),
});

export { mapLayerAddSchema };
