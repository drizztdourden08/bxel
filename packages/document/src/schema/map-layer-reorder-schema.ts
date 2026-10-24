/* @layer core @kind logic */
import { z } from 'zod';
import { mapLayerRefSchema } from './map-layer-ref-schema';
import { tilemapRefSchema } from './tilemap-ref-schema';

const mapLayerReorderSchema = z.strictObject({
  tilemap: tilemapRefSchema,
  layer: mapLayerRefSchema,
  to: z.number().int().min(0),
});

export { mapLayerReorderSchema };
