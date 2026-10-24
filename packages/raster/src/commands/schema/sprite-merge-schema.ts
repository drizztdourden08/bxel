/* @layer core @kind logic */
import { MAX_NAME_LENGTH } from '@bxel/document';
import { z } from 'zod';
import { resizeAnchorSchema } from './resize-anchor-schema';

const spriteMergeSchema = z.strictObject({
  name: z.string().min(1).max(MAX_NAME_LENGTH).optional(),
  anchor: resizeAnchorSchema.default('center'),
  keep: z.boolean().default(false),
});

export { spriteMergeSchema };
