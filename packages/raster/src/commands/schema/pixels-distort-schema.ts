/* @layer core @kind logic */
import { z } from 'zod';
import { allUsesSchema } from './all-uses-schema';
import { rotateAlgorithmSchema } from './rotate-algorithm-schema';
import { similarSchema } from './similar-schema';
import { boundsPolicySchema } from './bounds-policy-schema';
import { maskSchema } from './mask-schema';
import { skipZeroSchema } from './skip-zero-schema';
import { AXIS_LIMIT } from '../pixels-limits.constants';
import { isConvexQuad } from '../../region/is-convex-quad';

const coordinate = z.number().min(-AXIS_LIMIT).max(AXIS_LIMIT);
const corner = z.strictObject({ x: coordinate, y: coordinate });

const pixelsDistortSchema = z.strictObject({
  corners: z
    .tuple([corner, corner, corner, corner])
    .refine(isConvexQuad, { message: 'The corners must form a convex four sided shape.' })
    .describe('New places of the region box corners: top left, top right, bottom right, bottom left.'),
  algorithm: rotateAlgorithmSchema,
  similar: similarSchema,
  bounds: boundsPolicySchema,
  skipZero: skipZeroSchema,
  mask: maskSchema,
  allUses: allUsesSchema,
});

export { pixelsDistortSchema };
