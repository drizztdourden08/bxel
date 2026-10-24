/* @layer core @kind logic */
import { z } from 'zod';
import { ANCHOR_NAMES } from '../../region/region.constants';
import { boundsPolicySchema } from './bounds-policy-schema';
import { maskSchema } from './mask-schema';
import { scaleTargetSchema } from './scale-target-schema';
import { skipZeroSchema } from './skip-zero-schema';

const pixelsScaleSchema = z.strictObject({
  target: scaleTargetSchema,
  anchor: z.enum(ANCHOR_NAMES).default('top-left'),
  bounds: boundsPolicySchema,
  skipZero: skipZeroSchema,
  mask: maskSchema,
});

export { pixelsScaleSchema };
