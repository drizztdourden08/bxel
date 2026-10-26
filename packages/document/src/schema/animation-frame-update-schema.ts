/* @layer core @kind logic */
import { z } from 'zod';
import { animClipSchema } from './anim-clip-schema';
import { animFrameRefSchema } from './anim-frame-ref-schema';
import { animationRefSchema } from './animation-ref-schema';
import { ANIMATION_FRAME_UPDATE_FIELDS } from './animation-frame-update-schema.constants';
import { durationSchema } from './duration-schema';
import { pivotSchema } from './pivot-schema';
import { pointSchema } from './point-schema';
import { spriteRefSchema } from './sprite-ref-schema';

const animationFrameUpdateSchema = z
  .strictObject({
    animation: animationRefSchema,
    frame: animFrameRefSchema,
    sprite: spriteRefSchema.nullable().optional(),
    clip: animClipSchema.nullable().optional(),
    durationMs: durationSchema.optional(),
    offset: pointSchema.optional(),
    pivot: pivotSchema.nullable().optional(),
  })
  .refine((value) => ANIMATION_FRAME_UPDATE_FIELDS.some((field) => value[field] !== undefined), {
    message: 'Give a sprite, clip, duration, offset or pivot.',
  });

export { animationFrameUpdateSchema };
