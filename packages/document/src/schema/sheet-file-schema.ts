/* @layer core @kind logic */
import { z } from 'zod';
import { exportPresetSchema } from './export-preset-schema';
import { sheetSchema } from './sheet-schema';

const sheetFileSchema = z.object({ sheet: sheetSchema, presets: z.array(exportPresetSchema) });

export { sheetFileSchema };
