/* @layer core @kind logic */
import { z } from 'zod';
import { MAX_SHEET_COORD } from '../model/limits.constants';
import { layoutRequestSchema } from './layout-request-schema';
import { sheetRefSchema } from './sheet-ref-schema';
import { sheetPointSchema } from './sheet-point-schema';

const sheetUpdateSchema = z
  .strictObject({
    sheet: sheetRefSchema,
    name: z.string().optional(),
    layout: layoutRequestSchema.optional(),
    spacing: sheetPointSchema.optional(),
    margin: z.number().int().min(0).max(MAX_SHEET_COORD).optional(),
  })
  .refine(
    (value) => value.name !== undefined || value.layout !== undefined || value.spacing !== undefined || value.margin !== undefined,
    { message: 'Give a name, layout, spacing or margin.' },
  );

export { sheetUpdateSchema };
