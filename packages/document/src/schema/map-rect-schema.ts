/* @layer core @kind logic */
import { z } from 'zod';
import { cellFlagsSchema } from './cell-flags-schema';
import { mapLayerRefSchema } from './map-layer-ref-schema';
import { rectSchema } from './rect-schema';
import { tileRefSchema } from './tile-ref-schema';
import { tilemapRefSchema } from './tilemap-ref-schema';

const mapRectSchema = z.strictObject({
  tilemap: tilemapRefSchema,
  layer: mapLayerRefSchema,
  rect: rectSchema,
  tile: tileRefSchema,
  flags: cellFlagsSchema,
  filled: z.boolean().default(true),
});

export { mapRectSchema };
