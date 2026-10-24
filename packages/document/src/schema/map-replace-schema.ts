/* @layer core @kind logic */
import { z } from 'zod';
import { mapLayerRefSchema } from './map-layer-ref-schema';
import { rectSchema } from './rect-schema';
import { tileKeySchema } from './tile-key-schema';
import { tilemapRefSchema } from './tilemap-ref-schema';

const mapReplaceSchema = z.strictObject({
  tilemap: tilemapRefSchema,
  layer: mapLayerRefSchema,
  from: tileKeySchema,
  to: tileKeySchema,
  rect: rectSchema.optional(),
});

export { mapReplaceSchema };
