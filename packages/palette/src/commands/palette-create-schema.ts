/* @layer core @kind logic */
import { z } from 'zod';

const paletteCreateSchema = z.strictObject({
  name: z.string(),
  cap: z.number().int(),
  transparent: z.boolean(),
  colors: z.array(z.string()),
});

export { paletteCreateSchema };
