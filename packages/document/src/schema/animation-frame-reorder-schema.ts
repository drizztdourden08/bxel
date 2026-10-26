/* @layer core @kind logic */
import { z } from 'zod';
import { animFrameRefSchema } from './anim-frame-ref-schema';
import { animationRefSchema } from './animation-ref-schema';

const animationFrameReorderSchema = z.strictObject({
  animation: animationRefSchema,
  frame: animFrameRefSchema,
  to: z.number().int().min(0),
});

export { animationFrameReorderSchema };
