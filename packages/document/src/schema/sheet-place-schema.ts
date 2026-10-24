/* @layer core @kind logic */
import { z } from 'zod';
import { MAX_SHEET_COORD } from '../model/limits.constants';
import { sheetPointSchema } from './sheet-point-schema';
import { sheetRefSchema } from './sheet-ref-schema';

const shiftSchema = z.strictObject({
  x: z.number().int().min(-MAX_SHEET_COORD).max(MAX_SHEET_COORD),
  y: z.number().int().min(-MAX_SHEET_COORD).max(MAX_SHEET_COORD),
});

const sheetPlaceSchema = z
  .strictObject({ sheet: sheetRefSchema, at: sheetPointSchema.optional(), by: shiftSchema.optional() })
  .refine((value) => (value.at === undefined) !== (value.by === undefined), { message: 'Give either at or by.' });

export { sheetPlaceSchema };
