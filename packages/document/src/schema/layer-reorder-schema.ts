/* @layer core @kind logic */
import { z } from 'zod';
import { layerRefSchema } from './layer-ref-schema';

const layerReorderSchema = z.strictObject({
  layer: layerRefSchema,
  to: z.number().int().min(0),
});

export { layerReorderSchema };
