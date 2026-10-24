/* @layer core @kind logic */
import { z } from 'zod';
import { sheetRefSchema } from './sheet-ref-schema';

const sheetDeleteSchema = z.strictObject({ sheet: sheetRefSchema });

export { sheetDeleteSchema };
