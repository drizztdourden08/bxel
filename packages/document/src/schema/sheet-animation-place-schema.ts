/* @layer core @kind logic */
import { z } from 'zod';
import { animTagRefSchema } from './anim-tag-ref-schema';
import { animationRefSchema } from './animation-ref-schema';
import { sheetPointSchema } from './sheet-point-schema';
import { sheetRefSchema } from './sheet-ref-schema';

const sheetAnimationPlaceSchema = z.strictObject({
  sheet: sheetRefSchema,
  animation: animationRefSchema,
  tag: animTagRefSchema.nullable().optional(),
  at: sheetPointSchema,
});

export { sheetAnimationPlaceSchema };
