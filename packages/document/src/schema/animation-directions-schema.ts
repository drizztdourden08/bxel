/* @layer core @kind logic */
import { z } from 'zod';
import { animFacingSchema } from './anim-facing-schema';
import { animationRefSchema } from './animation-ref-schema';
import { durationSchema } from './duration-schema';

const animationDirectionsSchema = z.strictObject({
  animation: animationRefSchema,
  mode: z.enum(['four', 'eight']),
  tag: z.string().min(1).default('walk'),
  framesPerFacing: z.number().int().min(1).max(64).default(1),
  mirrored: z.array(animFacingSchema).default([]),
  durationMs: durationSchema.optional(),
  pattern: z.string().min(1).max(64).includes('{tag}').optional(),
});

export { animationDirectionsSchema };
