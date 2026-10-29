/* @layer core @kind logic */
import { z } from 'zod';
import { MAX_LAYOUT_COLUMNS } from '../model/tilemap-limits.constants';
import { tileKeySchema } from './tile-key-schema';
import { tilesetRefSchema } from './tileset-ref-schema';

const tilesetLayoutSchema = z.strictObject({
  tileset: tilesetRefSchema,
  columns: z.number().int().min(1).max(MAX_LAYOUT_COLUMNS).optional(),
  move: z.array(z.strictObject({ key: tileKeySchema.min(1), to: z.number().int().min(0) })).optional(),
});

export { tilesetLayoutSchema };
