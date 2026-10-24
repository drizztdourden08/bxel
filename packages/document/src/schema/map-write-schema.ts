/* @layer core @kind logic */
import { z } from 'zod';
import { MAX_BLOCK_CELLS } from '../model/tilemap-limits.constants';
import { ALL_FLAG_BITS } from '../tilemap/flag-bits.constants';
import { cellRectSchema } from './cell-rect-schema';
import { mapLayerRefSchema } from './map-layer-ref-schema';
import { tileKeySchema } from './tile-key-schema';
import { tilemapRefSchema } from './tilemap-ref-schema';

const mapWriteSchema = z
  .strictObject({
    tilemap: tilemapRefSchema,
    layer: mapLayerRefSchema,
    rect: cellRectSchema,
    keys: z.array(tileKeySchema).min(1).max(MAX_BLOCK_CELLS),
    flags: z.array(z.number().int().min(0).max(ALL_FLAG_BITS)).max(MAX_BLOCK_CELLS).optional(),
  })
  .refine((value) => value.rect.width * value.rect.height === value.keys.length, {
    path: ['keys'],
    message: 'keys holds one tile key for every cell of the rectangle, row by row.',
  })
  .refine((value) => value.flags === undefined || value.flags.length === value.keys.length, {
    path: ['flags'],
    message: 'flags holds one value for every cell of the rectangle: 1 flip x, 2 flip y, 4 turn.',
  });

export { mapWriteSchema };
