/* @layer core @kind logic */
import { z } from 'zod';
import { ROTATE_ANGLE_MAX } from '../advanced-commands.constants';
import { boundsPolicySchema } from './bounds-policy-schema';
import { maskSchema } from './mask-schema';
import { pivotSchema } from './pivot-schema';
import { skipZeroSchema } from './skip-zero-schema';

const pixelsRotateSchema = z.strictObject({
  angle: z.number().min(-ROTATE_ANGLE_MAX).max(ROTATE_ANGLE_MAX),
  pivot: pivotSchema,
  bounds: boundsPolicySchema,
  skipZero: skipZeroSchema,
  mask: maskSchema,
});

export { pixelsRotateSchema };
