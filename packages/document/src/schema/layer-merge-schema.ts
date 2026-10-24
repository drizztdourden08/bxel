/* @layer core @kind logic */
import { z } from 'zod';
import { layerRefSchema } from './layer-ref-schema';

const layerMergeSchema = z.strictObject({
  layer: layerRefSchema,
  allowLocked: z.boolean().default(false),
});

export { layerMergeSchema };
