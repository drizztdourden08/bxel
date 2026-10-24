/* @layer core @kind logic */
import { z } from 'zod';
import { layerRefSchema } from './layer-ref-schema';

const layerUpdateSchema = z
  .strictObject({
    layer: layerRefSchema,
    name: z.string().optional(),
    visible: z.boolean().optional(),
    locked: z.boolean().optional(),
  })
  .refine((value) => value.name !== undefined || value.visible !== undefined || value.locked !== undefined, {
    message: 'Give a name, visible or locked.',
  });

export { layerUpdateSchema };
