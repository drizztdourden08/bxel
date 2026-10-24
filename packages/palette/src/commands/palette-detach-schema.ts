/* @layer core @kind logic */
import { z } from 'zod';

const paletteDetachSchema = z.strictObject({
  name: z.string().optional(),
});

export { paletteDetachSchema };
