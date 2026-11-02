/* @layer core @kind logic */
import { z } from 'zod';
import { tileKeySchema } from './tile-key-schema';

const tilesetTerrainFillSchema = z.strictObject({
  set: z.string().min(1).max(48).describe('The id or name of the terrain set to fill.'),
  packing: z.string().min(1).max(32).describe('A packing id: blob47-7, blob47-6, blob47-12, blob16-4, blob16-8, corner16-4 or corner16-8. The block is read from the tile layout, left to right, top to bottom.'),
  start: tileKeySchema.min(1).optional().describe('The key of the tile at the top left of the block. Default: the first tile of the layout.'),
});

export { tilesetTerrainFillSchema };
