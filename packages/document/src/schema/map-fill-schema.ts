/* @layer core @kind logic */
import { z } from 'zod';
import { cellFlagsSchema } from './cell-flags-schema';
import { mapLayerRefSchema } from './map-layer-ref-schema';
import { pointSchema } from './point-schema';
import { tileRefSchema } from './tile-ref-schema';
import { tilemapRefSchema } from './tilemap-ref-schema';

const mapFillSchema = z.strictObject({
  tilemap: tilemapRefSchema,
  layer: mapLayerRefSchema,
  at: pointSchema,
  tile: tileRefSchema,
  flags: cellFlagsSchema,
});

export { mapFillSchema };
