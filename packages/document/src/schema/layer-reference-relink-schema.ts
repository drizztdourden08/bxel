/* @layer core @kind logic */
import { z } from 'zod';
import { layerRefSchema } from './layer-ref-schema';
import { layerReferenceSchema } from './layer-reference-schema';

const layerReferenceRelinkSchema = z
  .strictObject({
    layer: layerRefSchema,
    path: layerReferenceSchema.shape.path.optional(),
    x: layerReferenceSchema.shape.x.optional(),
    y: layerReferenceSchema.shape.y.optional(),
  })
  .refine((value) => value.path !== undefined || value.x !== undefined || value.y !== undefined, { message: 'Give a path, x or y.' });

export { layerReferenceRelinkSchema };
