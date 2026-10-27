/* @layer core @kind logic */
import { z } from 'zod';
import { animFrameRefSchema } from './anim-frame-ref-schema';
import { animationRefSchema } from './animation-ref-schema';

const animationSplitSchema = z.strictObject({
  animation: animationRefSchema,
  frames: z.array(animFrameRefSchema).min(1).optional(),
  strict: z
    .boolean()
    .optional()
    .describe('Fail with INVALID_OPTION when no named frame can be split, instead of changing nothing. Only a frame owned by the animation, or one that shows a clip of a strip, can be split.'),
});

export { animationSplitSchema };
