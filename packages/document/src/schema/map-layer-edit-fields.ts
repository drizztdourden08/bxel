/* @layer core @kind logic */
import { z } from 'zod';

const mapLayerEditFields = {
  name: z.string().optional(),
  visible: z.boolean().optional(),
  locked: z.boolean().optional(),
};

export { mapLayerEditFields };
