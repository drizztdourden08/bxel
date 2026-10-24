/* @layer core @kind logic */
import { z } from 'zod';

const rectSchema = z.strictObject({
  x: z.number().int(),
  y: z.number().int(),
  width: z.number().int().min(1),
  height: z.number().int().min(1),
});

const pixelsPatchSchema = z.strictObject({
  rect: rectSchema,
  pixels: z.instanceof(Uint8Array),
  skipZero: z.boolean().default(false),
  allUses: z.boolean().default(false),
});

export { pixelsPatchSchema };
