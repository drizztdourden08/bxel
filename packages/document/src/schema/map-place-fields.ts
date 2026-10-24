/* @layer core @kind logic */
import { mapCellsSchema } from './map-cells-schema';
import { mapLayerRefSchema } from './map-layer-ref-schema';
import { tilemapRefSchema } from './tilemap-ref-schema';

const mapPlaceFields = {
  tilemap: tilemapRefSchema,
  layer: mapLayerRefSchema,
  points: mapCellsSchema.optional(),
  cells: mapCellsSchema.optional(),
};

export { mapPlaceFields };
