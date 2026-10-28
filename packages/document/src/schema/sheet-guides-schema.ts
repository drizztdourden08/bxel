/* @layer core @kind logic */
import { z } from 'zod';
import { assetGuidesSchema } from './asset-guides-schema';
import { sheetRefSchema } from './sheet-ref-schema';

const sheetGuidesSchema = z.strictObject({ sheet: sheetRefSchema, guides: assetGuidesSchema });

export { sheetGuidesSchema };
