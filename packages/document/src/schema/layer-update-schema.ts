/* @layer core @kind logic */
import { z } from 'zod';
import { layerRefSchema } from './layer-ref-schema';
import { opacitySchema } from './opacity-schema';
import { tagColourOptionSchema } from './tag-colour-option-schema';

const lockPatchSchema = z
  .strictObject({ pixels: z.boolean().optional(), transparency: z.boolean().optional(), position: z.boolean().optional() })
  .describe('The lock kinds to set. pixels refuses every change, transparency paints only on pixels already painted, position refuses Move and Transform.');

const EDIT_KEYS = ['name', 'visible', 'locked', 'lockTransparency', 'lock', 'viewOpacity', 'clip', 'colour', 'exported'] as const;

const layerUpdateSchema = z
  .strictObject({
    layer: layerRefSchema,
    name: z.string().optional(),
    visible: z.boolean().optional(),
    locked: z.boolean().optional().describe('The same as lock.pixels.'),
    lockTransparency: z.boolean().optional().describe('The same as lock.transparency.'),
    lock: lockPatchSchema.optional(),
    viewOpacity: opacitySchema.optional().describe('The canvas opacity of the layer in percent. A view setting only: export and flatten ignore it.'),
    clip: z.boolean().optional().describe('Draw only where the pixel layer below in the same group has pixels.'),
    colour: tagColourOptionSchema.nullable().optional(),
    exported: z.boolean().optional().describe('false leaves the layer out of every export.'),
  })
  .refine((value) => EDIT_KEYS.some((key) => value[key] !== undefined), { message: `Give one of ${EDIT_KEYS.join(', ')}.` });

export { layerUpdateSchema };
