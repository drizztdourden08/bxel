/* @layer core @kind logic */
import { z } from 'zod';
import { ID_PREFIX } from '../ids/id-prefix.constants';
import type { MapLayerId } from '../model/ids.type';
import { brandedIdSchema } from './branded-id-schema';
import { mapLayerRefSchema } from './map-layer-ref-schema';
import { tilemapRefSchema } from './tilemap-ref-schema';

const mapLayerReorderSchema = z.strictObject({
  tilemap: tilemapRefSchema,
  layer: mapLayerRefSchema,
  to: z.number().int().min(0),
  parentId: brandedIdSchema<MapLayerId>(ID_PREFIX.mapLayer).nullable().optional().describe('The group the layer joins, or null for the top level.'),
});

export { mapLayerReorderSchema };
