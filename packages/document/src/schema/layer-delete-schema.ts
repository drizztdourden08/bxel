/* @layer core @kind logic */
import { z } from 'zod';
import { layerRefSchema } from './layer-ref-schema';

const layerDeleteSchema = z.strictObject({
  layer: layerRefSchema,
  allowLocked: z.boolean().default(false),
});

export { layerDeleteSchema };
