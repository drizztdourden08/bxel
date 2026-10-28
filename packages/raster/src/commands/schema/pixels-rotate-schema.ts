/* @layer core @kind logic */
import { z } from 'zod';
import { allUsesSchema } from './all-uses-schema';
import { ROTATE_ANGLE_MAX } from '../advanced-commands.constants';
import { boundsPolicySchema } from './bounds-policy-schema';
import { rotateAlgorithmSchema } from './rotate-algorithm-schema';
import { similarSchema } from './similar-schema';
import { maskSchema } from './mask-schema';
import { pivotSchema } from './pivot-schema';
import { skipZeroSchema } from './skip-zero-schema';

const pixelsRotateSchema = z.strictObject({
  angle: z.number().min(-ROTATE_ANGLE_MAX).max(ROTATE_ANGLE_MAX),
  pivot: pivotSchema,
  algorithm: rotateAlgorithmSchema,
  similar: similarSchema,
  bounds: boundsPolicySchema,
  skipZero: skipZeroSchema,
  mask: maskSchema,
  allUses: allUsesSchema,
});

export { pixelsRotateSchema };
