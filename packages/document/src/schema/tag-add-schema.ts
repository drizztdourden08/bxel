/* @layer core @kind logic */
import { z } from 'zod';
import { frameRefSchema } from './frame-ref-schema';
import { tagDirectionSchema } from './tag-direction-schema';
import { tagRepeatSchema } from './tag-repeat-schema';

const tagAddSchema = z.strictObject({
  name: z.string(),
  from: frameRefSchema,
  to: frameRefSchema,
  direction: tagDirectionSchema.default('forward'),
  repeat: tagRepeatSchema.default(0),
});

export { tagAddSchema };
