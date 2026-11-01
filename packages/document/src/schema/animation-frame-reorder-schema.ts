/* @layer core @kind logic */
import { z } from 'zod';
import { animFrameRefSchema } from './anim-frame-ref-schema';
import { animationRefSchema } from './animation-ref-schema';
import { oneOfFrames } from './one-of-frames';

const animationFrameReorderSchema = z
  .strictObject({
    animation: animationRefSchema,
    frame: animFrameRefSchema.optional(),
    frames: z.array(animFrameRefSchema).min(1).max(512).optional().describe('Move these frames as one block, in the order given, so the first lands at the position `to`.'),
    to: z.number().int().min(0),
  })
  .refine(oneOfFrames, { message: 'Give frame or frames, not both.' });

export { animationFrameReorderSchema };
