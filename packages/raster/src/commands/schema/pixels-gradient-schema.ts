/* @layer core @kind logic */
import { z } from 'zod';
import { allUsesSchema } from './all-uses-schema';
import { RAMP_POSITION_MAX } from '../advanced-commands.constants';
import { gradientLineSchema } from './gradient-line-schema';
import { maskSchema } from './mask-schema';
import { pointSchema } from './point-schema';
import { rampNameSchema } from './ramp-name-schema';

const position = z.number().int().min(0).max(RAMP_POSITION_MAX).optional();

const pixelsGradientSchema = z.strictObject({
  ramp: rampNameSchema,
  first: position,
  last: position,
  line: gradientLineSchema,
  mode: z.enum(['bands', 'dither']).default('bands'),
  dither: z.union([z.literal(2), z.literal(4), z.literal(8)]).default(4),
  origin: pointSchema.default({ x: 0, y: 0 }),
  mask: maskSchema,
  allUses: allUsesSchema,
});

export { pixelsGradientSchema };
