/* @layer core @kind logic */
import { z } from 'zod';
import { ID_PREFIX } from '../ids/id-prefix.constants';
import type { AnimationId, AnimFrameId, BankId, SpriteId, TagId } from '../model/ids.type';
import { MAX_DURATION_MS, MAX_SPRITE_SIZE, MIN_DURATION_MS, MIN_SPRITE_SIZE } from '../model/limits.constants';
import { animDirectionSchema } from './anim-direction-schema';
import { animDirectionsSchema } from './anim-directions-schema';
import { animFacingSchema } from './anim-facing-schema';
import { brandedIdSchema } from './branded-id-schema';
import { createdSchema } from './created-schema';
import { nameSchema } from './name-schema';
import { pivotSchema } from './pivot-schema';
import { pointSchema } from './point-schema';
import { rectSchema } from './rect-schema';
import { tagColourSchema } from './tag-colour-schema';

const frameId = brandedIdSchema<AnimFrameId>(ID_PREFIX.animFrame);
const tagId = brandedIdSchema<TagId>(ID_PREFIX.tag);
const sizeSchema = z.number().int().min(MIN_SPRITE_SIZE).max(MAX_SPRITE_SIZE);
const repeatSchema = z.number().int().min(0);

const animFrameSchema = z.object({
  id: frameId,
  spriteId: brandedIdSchema<SpriteId>(ID_PREFIX.sprite).nullable(),
  clip: rectSchema.nullable(),
  durationMs: z.number().int().min(MIN_DURATION_MS).max(MAX_DURATION_MS),
  offset: pointSchema,
  pivot: pivotSchema.nullable(),
});

const spanTagSchema = z.object({
  kind: z.literal('span'),
  id: tagId,
  name: nameSchema,
  from: frameId,
  to: frameId,
  direction: animDirectionSchema,
  repeat: repeatSchema,
  facing: animFacingSchema.optional(),
  colour: tagColourSchema.optional(),
});

const mirrorTagSchema = z.object({
  kind: z.literal('mirror'),
  id: tagId,
  of: tagId,
  flip: z.enum(['x', 'y']),
  facing: animFacingSchema,
});

const animationSchema = z.object({
  id: brandedIdSchema<AnimationId>(ID_PREFIX.animation),
  name: nameSchema,
  created: createdSchema.optional(),
  bankId: brandedIdSchema<BankId>(ID_PREFIX.bank),
  width: sizeSchema,
  height: sizeSchema,
  anchor: pivotSchema,
  loop: z.object({ direction: animDirectionSchema, repeat: repeatSchema }),
  directions: animDirectionsSchema,
  directionPattern: z.string().min(1).max(64),
  frames: z.array(animFrameSchema),
  tags: z.array(z.discriminatedUnion('kind', [spanTagSchema, mirrorTagSchema])),
});

export { animationSchema };
