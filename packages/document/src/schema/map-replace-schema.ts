/* @layer core @kind logic */
import { z } from 'zod';
import { cellMaskSchema } from './cell-mask-schema';
import { mapLayerRefSchema } from './map-layer-ref-schema';
import { rectSchema } from './rect-schema';
import { tileKeySchema } from './tile-key-schema';
import { tilemapRefSchema } from './tilemap-ref-schema';

const mapReplaceSchema = z
  .strictObject({
    tilemap: tilemapRefSchema,
    layer: mapLayerRefSchema,
    from: tileKeySchema,
    to: tileKeySchema,
    rect: rectSchema.optional(),
    within: cellMaskSchema.optional().describe('Only the described cells change. The default is the whole layer. It cannot be combined with rect.'),
  })
  .refine((value) => value.rect === undefined || value.within === undefined, { path: ['within'], message: 'Give a rect or a within mask, not both.' });

export { mapReplaceSchema };
