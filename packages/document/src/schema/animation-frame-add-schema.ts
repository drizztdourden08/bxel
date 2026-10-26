/* @layer core @kind logic */
import { z } from 'zod';
import { MAX_ANIMATION_FRAMES } from '../model/animation.constants';
import { animClipSchema } from './anim-clip-schema';
import { animCopyModeSchema } from './anim-copy-mode-schema';
import { animFrameRefSchema } from './anim-frame-ref-schema';
import { animStripGridSchema } from './anim-strip-grid-schema';
import { animationRefSchema } from './animation-ref-schema';
import { durationSchema } from './duration-schema';
import { pivotSchema } from './pivot-schema';
import { pointSchema } from './point-schema';
import { spriteRefSchema } from './sprite-ref-schema';

const count = z.number().int().min(1).max(MAX_ANIMATION_FRAMES);

const frameSourceSchema = z.discriminatedUnion('kind', [
  z.strictObject({ kind: z.literal('empty'), count: count.default(1) }),
  z.strictObject({
    kind: z.literal('sprite'),
    sprite: spriteRefSchema,
    clip: animClipSchema.optional(),
    mode: animCopyModeSchema.default('reference'),
  }),
  z.strictObject({ kind: z.literal('strip'), sprite: spriteRefSchema, grid: animStripGridSchema, count: count.optional() }),
  z.strictObject({ kind: z.literal('duplicate'), frame: animFrameRefSchema }),
]);

const animationFrameAddSchema = z.strictObject({
  animation: animationRefSchema,
  source: frameSourceSchema,
  at: z.number().int().min(0).optional(),
  durationMs: durationSchema.optional(),
  offset: pointSchema.optional(),
  pivot: pivotSchema.optional(),
});

export { animationFrameAddSchema };
