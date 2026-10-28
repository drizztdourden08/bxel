/* @layer core @kind logic */
import { z } from 'zod';
import { GUIDE_STEP, MAX_GUIDES, MAX_SHEET_COORD } from '../model/limits.constants';

const position = z.number().min(0).max(MAX_SHEET_COORD).multipleOf(GUIDE_STEP);

const line = z.array(position).max(MAX_GUIDES);

const assetGuidesSchema = z.strictObject({ x: line, y: line });

export { assetGuidesSchema };
