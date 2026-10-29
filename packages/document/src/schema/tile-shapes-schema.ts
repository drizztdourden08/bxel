/* @layer core @kind logic */
import { z } from 'zod';
import { MAX_TILE_SHAPES } from '../model/tilemap-limits.constants';
import { tileKeySchema } from './tile-key-schema';
import { tileShapeSchema } from './tile-shape-schema';
import { tilesetRefSchema } from './tileset-ref-schema';

const tileShapesSchema = z.strictObject({
  tileset: tilesetRefSchema,
  keys: z.array(tileKeySchema.min(1)).min(1),
  shapes: z.array(tileShapeSchema).max(MAX_TILE_SHAPES),
  mode: z.enum(['set', 'add', 'layer']).default('set'),
});

export { tileShapesSchema };
