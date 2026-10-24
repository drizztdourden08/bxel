/* @layer core @kind logic */
import { z } from 'zod';
import { rectSchema } from './rect-schema';
import { sheetPointSchema } from './sheet-point-schema';
import { sheetRefSchema } from './sheet-ref-schema';

const placeSchema = z.strictObject({ at: sheetPointSchema, source: rectSchema.nullable().optional() });

const sheetAddSchema = z.strictObject({
  sheet: sheetRefSchema,
  places: z.array(placeSchema).optional(),
});

export { sheetAddSchema };
