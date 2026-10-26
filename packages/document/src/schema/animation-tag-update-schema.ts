/* @layer core @kind logic */
import { z } from 'zod';
import { animDirectionSchema } from './anim-direction-schema';
import { animFacingSchema } from './anim-facing-schema';
import { animFrameRefSchema } from './anim-frame-ref-schema';
import { animTagRefSchema } from './anim-tag-ref-schema';
import { animationRefSchema } from './animation-ref-schema';
import { ANIMATION_TAG_UPDATE_FIELDS } from './animation-tag-update-schema.constants';
import { tagColourOptionSchema } from './tag-colour-option-schema';
import { tagRepeatSchema } from './tag-repeat-schema';

const animationTagUpdateSchema = z
  .strictObject({
    animation: animationRefSchema,
    tag: animTagRefSchema,
    name: z.string().optional(),
    from: animFrameRefSchema.optional(),
    to: animFrameRefSchema.optional(),
    direction: animDirectionSchema.optional(),
    repeat: tagRepeatSchema.optional(),
    colour: tagColourOptionSchema.nullable().optional(),
    facing: animFacingSchema.nullable().optional(),
    flip: z.enum(['x', 'y']).optional(),
    of: animTagRefSchema.optional(),
  })
  .refine((value) => ANIMATION_TAG_UPDATE_FIELDS.some((field) => value[field] !== undefined), {
    message: 'Give a name, span, direction, repeat, colour, facing, flip or base tag.',
  });

export { animationTagUpdateSchema };
