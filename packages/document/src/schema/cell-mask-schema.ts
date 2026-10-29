/* @layer core @kind logic */
import { z } from 'zod';
import { BASE_MEMBERS } from './cell-mask-schema.constants';

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
