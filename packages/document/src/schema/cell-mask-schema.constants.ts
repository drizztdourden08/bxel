/* @layer core @kind constants */
import { z } from 'zod';
import { MAX_BLOCK_CELLS } from '../model/tilemap-limits.constants';
import { cellPointSchema } from './cell-point-schema';
import { cellRectSchema } from './cell-rect-schema';
import { tileKeySchema } from './tile-key-schema';

const MAX_CELL_RUNS = 65536;

const BASE_MEMBERS = [
  z.strictObject({ by: z.literal('rect'), rect: cellRectSchema }),
  z.strictObject({ by: z.literal('cells'), cells: z.array(cellPointSchema).min(1).max(MAX_BLOCK_CELLS) }),
  z.strictObject({
    by: z.literal('wand'),
    x: z.number().int().min(0),
    y: z.number().int().min(0),
    connectivity: z.union([z.literal(4), z.literal(8)]).default(4),
  }),
  z.strictObject({ by: z.literal('same'), x: z.number().int().min(0), y: z.number().int().min(0) }),
  z.strictObject({ by: z.literal('tile'), key: tileKeySchema }),
  z.strictObject({
    by: z.literal('runs'),
    runs: z.array(z.tuple([z.number().int().min(0), z.number().int().min(0), z.number().int().min(0)])).min(1).max(MAX_CELL_RUNS),
  }),
] as const;

export { BASE_MEMBERS, MAX_CELL_RUNS };
