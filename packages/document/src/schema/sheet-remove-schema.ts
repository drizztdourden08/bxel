/* @layer core @kind logic */
import { z } from 'zod';
import { sheetRefSchema } from './sheet-ref-schema';

const sheetRemoveSchema = z.strictObject({ sheet: sheetRefSchema });

export { sheetRemoveSchema };
