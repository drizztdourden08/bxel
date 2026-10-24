/* @layer core @kind logic */
import { MAX_PATCH_PIXELS, MAX_SPRITE_SIZE } from '@bxel/document';
import { z } from 'zod';

const side = z.number().int().min(1).max(MAX_SPRITE_SIZE);

const patchSchema = z
  .strictObject({ width: side, height: side, pixels: z.instanceof(Uint8Array) })
  .refine((patch) => patch.pixels.length === patch.width * patch.height, {
    message: 'pixels must hold width * height bytes.',
    path: ['pixels'],
  })
  .refine((patch) => patch.width * patch.height <= MAX_PATCH_PIXELS, {
    message: `A patch holds at most ${MAX_PATCH_PIXELS} pixels.`,
    path: ['pixels'],
  });

export { patchSchema };
