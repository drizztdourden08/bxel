/* @layer core @kind logic */
import { z } from 'zod';
import { allUsesSchema } from './all-uses-schema';
import { RAMP_POSITION_MAX } from '../advanced-commands.constants';
import { indexSchema } from './index-schema';
import { gradientLineSchema } from './gradient-line-schema';
import { maskSchema } from './mask-schema';
import { pointSchema } from './point-schema';
import { rampNameSchema } from './ramp-name-schema';
import { wrapSchema } from './wrap-schema';

const position = z.number().int().min(0).max(RAMP_POSITION_MAX).optional();

const pixelsGradientSchema = z
  .strictObject({
  ramp: rampNameSchema.optional(),
  colors: z.array(indexSchema).min(2).max(RAMP_POSITION_MAX + 1).optional(),
  first: position,
  last: position,
  line: gradientLineSchema,
  kind: z.enum(['linear', 'radial']).default('linear'),
  reflect: z.boolean().default(false),
  mode: z.enum(['bands', 'dither']).default('bands'),
  dither: z.union([z.literal(2), z.literal(4), z.literal(8)]).default(4),
  pattern: z.enum(['bayer', 'checker', 'rows', 'columns']).default('bayer'),
  origin: pointSchema.default({ x: 0, y: 0 }),
  mask: maskSchema,
  wrap: wrapSchema,
  allUses: allUsesSchema,
})
  .refine((options) => (options.ramp === undefined) !== (options.colors === undefined), {
    message: 'Give either a ramp name or a list of colours.',
    path: ['ramp'],
  });

export { pixelsGradientSchema };
