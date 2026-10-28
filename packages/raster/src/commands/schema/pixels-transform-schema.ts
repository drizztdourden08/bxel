/* @layer core @kind logic */
import { z } from 'zod';
import { ROTATE_ANGLE_MAX } from '../advanced-commands.constants';
import { rotateAlgorithmSchema } from './rotate-algorithm-schema';
import { allUsesSchema } from './all-uses-schema';
import { boundsPolicySchema } from './bounds-policy-schema';
import { maskSchema } from './mask-schema';
import { pivotSchema } from './pivot-schema';
import { OFFSET_LIMIT, SCALE_LIMIT, SKEW_LIMIT } from './pixels-transform-schema.constants';
import { similarSchema } from './similar-schema';
import { skipZeroSchema } from './skip-zero-schema';

const factor = z.number().min(-SCALE_LIMIT).max(SCALE_LIMIT);
const slant = z.number().min(-SKEW_LIMIT).max(SKEW_LIMIT);
const shift = z.number().min(-OFFSET_LIMIT).max(OFFSET_LIMIT);

const pair = <T extends z.ZodType>(item: T) => z.strictObject({ x: item, y: item });

const pixelsTransformSchema = z.strictObject({
  scale: pair(factor).default({ x: 1, y: 1 }).describe('Scale factors. A negative factor flips.'),
  angle: z.number().min(-ROTATE_ANGLE_MAX).max(ROTATE_ANGLE_MAX).default(0).describe('Degrees, clockwise.'),
  skew: pair(slant).default({ x: 0, y: 0 }).describe('Skew in degrees along each axis.'),
  offset: pair(shift).default({ x: 0, y: 0 }).describe('Pixels to move the result by. Whole numbers keep the pixels on the grid.'),
  matrix: z.tuple([z.number(), z.number(), z.number(), z.number()]).optional().describe('Row by row 2 by 2 matrix [a, b, c, d]. Replaces scale, angle and skew.'),
  pivot: pivotSchema,
  algorithm: rotateAlgorithmSchema,
  similar: similarSchema,
  bounds: boundsPolicySchema,
  skipZero: skipZeroSchema,
  mask: maskSchema,
  allUses: allUsesSchema,
});

export { pixelsTransformSchema };
