/* @layer core @kind logic */
import { z } from 'zod';
import { MAX_ANIMATION_FRAMES } from '../model/animation.constants';
import { MAX_SPRITE_SIZE } from '../model/limits.constants';
import { animCopyModeSchema } from './anim-copy-mode-schema';
import { animStripGridSchema } from './anim-strip-grid-schema';
import { durationSchema } from './duration-schema';
import { idSchema } from './id-schema';
import { spriteRefSchema } from './sprite-ref-schema';

const size = z.number().int().min(1).max(MAX_SPRITE_SIZE);
const count = z.number().int().min(1).max(MAX_ANIMATION_FRAMES);

const animSourceSchema = z.discriminatedUnion('kind', [
  z.strictObject({
    kind: z.literal('blank'),
    width: size,
    height: size,
    frames: count.default(1),
    bankId: idSchema('bnk').optional(),
    durationMs: durationSchema.optional(),
  }),
  z.strictObject({
    kind: z.literal('sprites'),
    sprites: z.array(spriteRefSchema).min(1).max(MAX_ANIMATION_FRAMES),
    mode: animCopyModeSchema.default('reference'),
    durationMs: durationSchema.optional(),
  }),
  z.strictObject({
    kind: z.literal('sprite'),
    sprite: spriteRefSchema,
    mode: animCopyModeSchema.default('reference'),
    durationMs: durationSchema.optional(),
  }),
  z.strictObject({
    kind: z.literal('strip'),
    sprite: spriteRefSchema,
    grid: animStripGridSchema,
    count: count.optional(),
    durationMs: durationSchema.optional(),
  }),
]);

export { animSourceSchema };
