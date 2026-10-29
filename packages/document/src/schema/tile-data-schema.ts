/* @layer core @kind logic */
import { z } from 'zod';
import { MAX_TILE_PROBABILITY } from '../model/tilemap-limits.constants';
import { fieldValueSchema } from './tile-field-schema';
import { tileKeySchema } from './tile-key-schema';
import { tilesetRefSchema } from './tileset-ref-schema';

const tileDataSchema = z.strictObject({
  tileset: tilesetRefSchema,
  keys: z.array(tileKeySchema.min(1)).min(1),
  type: z.string().max(64).nullable().optional(),
  probability: z.number().min(0).max(MAX_TILE_PROBABILITY).nullable().optional(),
  turns: z.enum(['none', 'flips', 'all']).nullable().optional(),
  data: z.record(z.string(), fieldValueSchema.nullable()).optional(),
});

export { tileDataSchema };
