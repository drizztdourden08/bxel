/* @layer core @kind logic */
import { durationSchema } from '@bxel/document/schema';
import { z } from 'zod';

const importFrameSchema = z.strictObject({
  rgba: z.union([z.instanceof(Uint8Array), z.instanceof(Uint8ClampedArray)]),
  durationMs: durationSchema,
});

export { importFrameSchema };
