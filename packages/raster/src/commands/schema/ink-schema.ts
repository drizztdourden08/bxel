/* @layer core @kind logic */
import { z } from 'zod';
import { DITHER_LEVEL_DEFAULT, DITHER_LEVEL_MAX, DITHER_PATTERNS, INK_STEPS_MAX } from '../../ink/ink.constants';
import { indexSchema } from './index-schema';
import { rampNameSchema } from './ramp-name-schema';

const steps = z.number().int().min(1).max(INK_STEPS_MAX).default(1);

const inkSchema = z
  .discriminatedUnion('kind', [
    z.strictObject({ kind: z.literal('normal') }),
    z.strictObject({ kind: z.literal('behind') }),
    z.strictObject({ kind: z.literal('lockAlpha') }),
    z.strictObject({ kind: z.literal('onlyColour'), index: indexSchema }),
    z.strictObject({
      kind: z.literal('dither'),
      pattern: z.enum(DITHER_PATTERNS).default('checker'),
      level: z.number().int().min(1).max(DITHER_LEVEL_MAX).default(DITHER_LEVEL_DEFAULT),
      second: indexSchema,
    }),
    z.strictObject({ kind: z.literal('shade'), ramp: rampNameSchema.optional(), direction: z.enum(['up', 'down']), steps }),
    z.strictObject({ kind: z.literal('lighten'), steps }),
    z.strictObject({ kind: z.literal('darken'), steps }),
    z.strictObject({ kind: z.literal('pattern'), brushId: z.string().min(1), originX: z.number().int().default(0), originY: z.number().int().default(0) }),
  ])
  .optional();

export { inkSchema };
