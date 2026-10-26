/* @layer core @kind logic */
import { z } from 'zod';
import { animTagRefSchema } from './anim-tag-ref-schema';
import { animationRefSchema } from './animation-ref-schema';
import { sheetPointSchema } from './sheet-point-schema';
import { sheetRefSchema } from './sheet-ref-schema';

const sheetAnimationAddSchema = z.strictObject({
  sheet: sheetRefSchema,
  animation: animationRefSchema,
  tag: animTagRefSchema.nullable().default(null),
  at: sheetPointSchema.optional(),
});

export { sheetAnimationAddSchema };
