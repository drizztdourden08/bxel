/* @layer core @kind logic */
import { z } from 'zod';
import { animFrameRefSchema } from './anim-frame-ref-schema';
import { animationRefSchema } from './animation-ref-schema';

const animationFrameDeleteSchema = z.strictObject({
  animation: animationRefSchema,
  frames: z.array(animFrameRefSchema).min(1),
});

export { animationFrameDeleteSchema };
