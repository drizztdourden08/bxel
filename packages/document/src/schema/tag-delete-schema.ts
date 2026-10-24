/* @layer core @kind logic */
import { z } from 'zod';
import { tagRefSchema } from './tag-ref-schema';

const tagDeleteSchema = z.strictObject({
  tag: tagRefSchema,
});

export { tagDeleteSchema };
