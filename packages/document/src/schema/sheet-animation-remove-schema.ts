/* @layer core @kind logic */
import { z } from 'zod';
import { animTagRefSchema } from './anim-tag-ref-schema';
import { animationRefSchema } from './animation-ref-schema';
import { sheetRefSchema } from './sheet-ref-schema';

const sheetAnimationRemoveSchema = z.strictObject({
  sheet: sheetRefSchema,
  animation: animationRefSchema,
  tag: animTagRefSchema.nullable().optional(),
});

export { sheetAnimationRemoveSchema };
