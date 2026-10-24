/* @layer core @kind logic */
import { z } from 'zod';
import { layerRefSchema } from './layer-ref-schema';

const layerAddSchema = z.strictObject({
  name: z.string().optional(),
  above: layerRefSchema.optional(),
});

export { layerAddSchema };
