/* @layer core @kind logic */
import { z } from 'zod';
import { SHADE_STEPS_MAX } from '../advanced-commands.constants';
import { rampNameSchema } from './ramp-name-schema';
import { strokeFields } from './stroke-fields';

const pixelsShadeSchema = z.strictObject({
  ramp: rampNameSchema,
  direction: z.enum(['up', 'down']),
  steps: z.number().int().min(1).max(SHADE_STEPS_MAX).default(1),
  ...strokeFields,
});

export { pixelsShadeSchema };
