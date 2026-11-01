/* @layer core @kind logic */
import { z } from 'zod';
import { animFrameRefSchema } from './anim-frame-ref-schema';
import { animationRefSchema } from './animation-ref-schema';

const animationFrameReverseSchema = z.strictObject({
  animation: animationRefSchema,
  frames: z
    .array(animFrameRefSchema)
    .min(2)
    .max(512)
    .optional()
    .describe('Reverse the order of these frames among the places they hold. Without it every frame of the animation is reversed.'),
});

export { animationFrameReverseSchema };
