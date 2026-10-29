/* @layer core @kind logic */
import { z } from 'zod';
import { animTagRefSchema } from './anim-tag-ref-schema';
import { animationRefSchema } from './animation-ref-schema';
import { sheetRefSchema } from './sheet-ref-schema';

const sheetAnimationMoveSchema = z.strictObject({
  sheet: sheetRefSchema,
  animation: animationRefSchema,
  tag: animTagRefSchema.nullable().optional(),
  to: z.number().int().min(0),
});

export { sheetAnimationMoveSchema };
