/* @layer core @kind logic */
import { z } from 'zod';
import { frameRefSchema } from './frame-ref-schema';
import { tagDirectionSchema } from './tag-direction-schema';
import { tagRefSchema } from './tag-ref-schema';
import { tagRepeatSchema } from './tag-repeat-schema';

const tagUpdateSchema = z
  .strictObject({
    tag: tagRefSchema,
    name: z.string().optional(),
    from: frameRefSchema.optional(),
    to: frameRefSchema.optional(),
    direction: tagDirectionSchema.optional(),
    repeat: tagRepeatSchema.optional(),
  })
  .refine(
    (value) =>
      value.name !== undefined ||
      value.from !== undefined ||
      value.to !== undefined ||
      value.direction !== undefined ||
      value.repeat !== undefined,
    { message: 'Give a name, from, to, direction or repeat.' },
  );

export { tagUpdateSchema };
