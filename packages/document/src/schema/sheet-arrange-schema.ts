/* @layer core @kind logic */
import { z } from 'zod';
import { MAX_SHEET_COORD } from '../model/limits.constants';
import { layoutRequestSchema } from './layout-request-schema';
import { sheetRefSchema } from './sheet-ref-schema';
import { sheetPointSchema } from './sheet-point-schema';

const sheetArrangeSchema = z.strictObject({
  sheet: sheetRefSchema,
  layout: layoutRequestSchema,
  spacing: sheetPointSchema.optional(),
  margin: z.number().int().min(0).max(MAX_SHEET_COORD).optional(),
});

export { sheetArrangeSchema };
