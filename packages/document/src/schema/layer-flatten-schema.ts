/* @layer core @kind logic */
import { z } from 'zod';

const layerFlattenSchema = z.strictObject({
  name: z.string().optional(),
});

export { layerFlattenSchema };
