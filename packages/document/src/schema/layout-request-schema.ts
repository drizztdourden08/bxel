/* @layer core @kind logic */
import { z } from 'zod';

const positive = z.number().int().min(1);

const layoutRequestSchema = z.discriminatedUnion('kind', [
  z.strictObject({ kind: z.literal('manual') }),
  z.strictObject({
    kind: z.literal('grid'),
    columns: positive.optional(),
    cellWidth: positive.optional(),
    cellHeight: positive.optional(),
    order: z.enum(['rows', 'columns']).optional(),
  }),
  z.strictObject({ kind: z.literal('packed'), maxWidth: positive.optional() }),
]);

export { layoutRequestSchema };
