/* @layer core @kind logic */
import { z } from 'zod';

const importImageSchema = z.strictObject({
  width: z.number().int(),
  height: z.number().int(),
  rgba: z.union([z.instanceof(Uint8Array), z.instanceof(Uint8ClampedArray)]),
});

export { importImageSchema };
