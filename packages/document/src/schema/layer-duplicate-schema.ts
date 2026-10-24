/* @layer core @kind logic */
import { z } from 'zod';
import { layerRefSchema } from './layer-ref-schema';

const layerDuplicateSchema = z.strictObject({
  layer: layerRefSchema,
  name: z.string().optional(),
});

export { layerDuplicateSchema };
