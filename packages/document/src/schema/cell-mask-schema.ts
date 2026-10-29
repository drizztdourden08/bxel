/* @layer core @kind logic */
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

const baseCellMaskSchema = z.discriminatedUnion('by', BASE_MEMBERS);

const cellMaskSchema = z
  .discriminatedUnion('by', [
    ...BASE_MEMBERS,
    z.strictObject({
      by: z.literal('combine'),
      op: z.enum(['add', 'subtract', 'intersect']),
      of: z.array(baseCellMaskSchema).min(2).max(16),
    }),
  ])
  .describe(
    'A set of map cells, described instead of drawn. rect is a block of cells. cells lists them. runs lists row runs as [row, first column, last column], last included. wand takes the connected cells that hold the same tile and the same turn bits as the cell at x, y. same takes every cell of the layer that holds the tile of the cell at x, y, whatever its turn. tile takes every cell that holds that tile key. combine joins (add), cuts every later part out of the first (subtract) or keeps the overlap (intersect).',
  );

export { cellMaskSchema };
