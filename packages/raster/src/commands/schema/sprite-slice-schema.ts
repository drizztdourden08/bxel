/* @layer core @kind logic */
import { MAX_SPRITE_SIZE } from '@bxel/document';
import { z } from 'zod';
import { pieceFields } from './piece-fields';

const count = z.number().int().min(1).max(MAX_SPRITE_SIZE);

const pair = (first: unknown, second: unknown): boolean => (first === undefined) === (second === undefined);

const spriteSliceSchema = z
  .strictObject({
    ...pieceFields,
    columns: count.optional(),
    rows: count.optional(),
    cellWidth: count.optional(),
    cellHeight: count.optional(),
    islands: z.strictObject({ minSize: z.number().int().min(1).max(MAX_SPRITE_SIZE), merge: z.number().int().min(0).max(MAX_SPRITE_SIZE) }).optional(),
    existing: z.enum(['fail', 'keep', 'skip']).default('fail'),
    skipEmpty: z.boolean().default(true),
  })
  .refine(
    (value) =>
      value.islands === undefined
        ? pair(value.columns, value.rows) && pair(value.cellWidth, value.cellHeight) && (value.columns === undefined) !== (value.cellWidth === undefined)
        : value.columns === undefined && value.rows === undefined && value.cellWidth === undefined && value.cellHeight === undefined,
    { message: 'Give columns and rows, cellWidth and cellHeight, or islands.' },
  );

export { spriteSliceSchema };
