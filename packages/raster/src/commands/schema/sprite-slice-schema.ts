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
    skipEmpty: z.boolean().default(true),
  })
  .refine(
    (value) =>
      pair(value.columns, value.rows) &&
      pair(value.cellWidth, value.cellHeight) &&
      (value.columns === undefined) !== (value.cellWidth === undefined),
    { message: 'Give columns and rows, or cellWidth and cellHeight.' },
  );

export { spriteSliceSchema };
