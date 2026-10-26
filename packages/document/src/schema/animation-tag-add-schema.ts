/* @layer core @kind logic */
import { z } from 'zod';
import { animDirectionSchema } from './anim-direction-schema';
import { animFacingSchema } from './anim-facing-schema';
import { animFrameRefSchema } from './anim-frame-ref-schema';
import { animTagRefSchema } from './anim-tag-ref-schema';
import { animationRefSchema } from './animation-ref-schema';
import { tagColourOptionSchema } from './tag-colour-option-schema';
import { tagRepeatSchema } from './tag-repeat-schema';

const animationTagAddSchema = z.discriminatedUnion('kind', [
  z.strictObject({
    animation: animationRefSchema,
    kind: z.literal('span'),
    name: z.string(),
    from: animFrameRefSchema,
    to: animFrameRefSchema,
    direction: animDirectionSchema.default('forward'),
    repeat: tagRepeatSchema.default(0),
    facing: animFacingSchema.optional(),
    colour: tagColourOptionSchema.optional(),
  }),
  z.strictObject({
    animation: animationRefSchema,
    kind: z.literal('mirror'),
    of: animTagRefSchema,
    flip: z.enum(['x', 'y']).default('x'),
    facing: animFacingSchema,
  }),
]);

export { animationTagAddSchema };
