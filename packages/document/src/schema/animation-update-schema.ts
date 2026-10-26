/* @layer core @kind logic */
import { z } from 'zod';
import { MAX_SPRITE_SIZE } from '../model/limits.constants';
import { animDirectionSchema } from './anim-direction-schema';
import { animDirectionsSchema } from './anim-directions-schema';
import { animationRefSchema } from './animation-ref-schema';
import { ANIMATION_UPDATE_FIELDS } from './animation-update-schema.constants';
import { idSchema } from './id-schema';
import { pivotSchema } from './pivot-schema';
import { tagRepeatSchema } from './tag-repeat-schema';

const size = z.number().int().min(1).max(MAX_SPRITE_SIZE);

const animationUpdateSchema = z
  .strictObject({
    animation: animationRefSchema,
    name: z.string().optional(),
    width: size.optional(),
    height: size.optional(),
    anchor: pivotSchema.optional(),
    loopDirection: animDirectionSchema.optional(),
    loopRepeat: tagRepeatSchema.optional(),
    directions: animDirectionsSchema.optional(),
    directionPattern: z.string().min(1).max(64).includes('{tag}').optional(),
    bankId: idSchema('bnk').optional(),
  })
  .refine((value) => ANIMATION_UPDATE_FIELDS.some((field) => value[field] !== undefined), {
    message: 'Give a name, size, anchor, loop, directions, direction pattern or palette.',
  });

export { animationUpdateSchema };
