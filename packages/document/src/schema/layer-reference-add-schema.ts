/* @layer core @kind logic */
import { z } from 'zod';
import { layerRefSchema } from './layer-ref-schema';
import { layerReferenceSchema } from './layer-reference-schema';
import { opacitySchema } from './opacity-schema';

const layerReferenceAddSchema = z.strictObject({
  path: layerReferenceSchema.shape.path.describe('The image file the layer shows. It is linked, never copied into the document.'),
  x: layerReferenceSchema.shape.x.default(0),
  y: layerReferenceSchema.shape.y.default(0),
  name: z.string().optional(),
  above: layerRefSchema.optional().describe('Place it above this layer. Absent: at the bottom of the stack.'),
  viewOpacity: opacitySchema.default(50),
});

export { layerReferenceAddSchema };
