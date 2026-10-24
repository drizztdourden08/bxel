/* @layer core @kind logic */
import { z } from 'zod';
import { mapCellsSchema } from './map-cells-schema';
import { mapLayerRefSchema } from './map-layer-ref-schema';
import { tilemapRefSchema } from './tilemap-ref-schema';

const tileUniqueSchema = z.strictObject({
  tilemap: tilemapRefSchema,
  layer: mapLayerRefSchema,
  cells: mapCellsSchema,
  name: z.string().optional(),
});

export { tileUniqueSchema };
