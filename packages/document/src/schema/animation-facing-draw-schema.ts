/* @layer core @kind logic */
import { z } from 'zod';
import { animFacingSchema } from './anim-facing-schema';
import { animationRefSchema } from './animation-ref-schema';

const animationFacingDrawSchema = z.strictObject({ animation: animationRefSchema, facing: animFacingSchema });

export { animationFacingDrawSchema };
