/* @layer core @kind logic */
import { z } from 'zod';
import { tagColourOptionSchema } from './tag-colour-option-schema';

const mapLayerEditFields = {
  name: z.string().optional(),
  visible: z.boolean().optional(),
  locked: z.boolean().optional(),
  colour: tagColourOptionSchema.nullable().optional(),
};

export { mapLayerEditFields };
