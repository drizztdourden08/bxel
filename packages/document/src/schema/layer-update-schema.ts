/* @layer core @kind logic */
import { z } from 'zod';
import { layerRefSchema } from './layer-ref-schema';
import { tagColourOptionSchema } from './tag-colour-option-schema';

const layerUpdateSchema = z
  .strictObject({
    layer: layerRefSchema,
    name: z.string().optional(),
    visible: z.boolean().optional(),
    locked: z.boolean().optional(),
    lockTransparency: z.boolean().optional(),
    colour: tagColourOptionSchema.nullable().optional(),
  })
  .refine(
    (value) =>
      value.name !== undefined ||
      value.visible !== undefined ||
      value.locked !== undefined ||
      value.lockTransparency !== undefined ||
      value.colour !== undefined,
    { message: 'Give a name, visible, locked, lockTransparency or colour.' },
  );

export { layerUpdateSchema };
