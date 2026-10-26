/* @layer core @kind logic */
import { z } from 'zod';
import { animFrameRefSchema } from './anim-frame-ref-schema';
import { animationRefSchema } from './animation-ref-schema';

const animationFramePickSchema = z.strictObject({ animation: animationRefSchema, frame: animFrameRefSchema });

export { animationFramePickSchema };
