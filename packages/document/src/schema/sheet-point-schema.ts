/* @layer core @kind logic */
import { z } from 'zod';
import { MAX_SHEET_COORD } from '../model/limits.constants';

const sheetPointSchema = z.strictObject({
  x: z.number().int().min(0).max(MAX_SHEET_COORD),
  y: z.number().int().min(0).max(MAX_SHEET_COORD),
});

export { sheetPointSchema };
