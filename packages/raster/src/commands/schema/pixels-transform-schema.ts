/* @layer core @kind logic */
import { z } from 'zod';
import { allUsesSchema } from './all-uses-schema';
import { rotateAlgorithmSchema, similarSchema } from './algorithm-schema';
import { boundsPolicySchema } from './bounds-policy-schema';
import { maskSchema } from './mask-schema';
import { pivotSchema } from './pivot-schema';
import { skipZeroSchema } from './skip-zero-schema';
import { affineMatrix, determinant } from '../../region/affine-matrix';
import { ROTATE_ANGLE_MAX } from '../advanced-commands.constants';

const SCALE_LIMIT = 64;
const SKEW_LIMIT = 80;
const MIN_DETERMINANT = 1e-6;

const factor = z.number().min(-SCALE_LIMIT).max(SCALE_LIMIT);
const slant = z.number().min(-SKEW_LIMIT).max(SKEW_LIMIT);

const OFFSET_LIMIT = 8192;
const shift = z.number().min(-OFFSET_LIMIT).max(OFFSET_LIMIT);

const pair = <T extends z.ZodType>(item: T) => z.strictObject({ x: item, y: item });

const pixelsTransformSchema = z
  .strictObject({
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
  })
  .refine((options) => Math.abs(determinant(affineMatrix({ ...options, pivot: undefined }))) > MIN_DETERMINANT, {
    message: 'The transform would flatten the region to nothing.',
    path: ['scale'],
  });

export { pixelsTransformSchema };
