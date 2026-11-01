/* @layer core @kind logic */
import { z } from 'zod';
import { opacitySchema } from './opacity-schema';
import { tagColourOptionSchema } from './tag-colour-option-schema';

const mapLayerEditFields = {
  name: z.string().optional(),
  visible: z.boolean().optional(),
  locked: z.boolean().optional(),
  colour: tagColourOptionSchema.nullable().optional(),
  opacity: opacitySchema.optional().describe('The layer opacity in percent, written to Tiled and JSON exports.'),
};

export { mapLayerEditFields };
