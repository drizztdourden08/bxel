/* @layer core @kind logic */
import { MAX_SPRITE_SIZE } from '@bxel/document';
import { z } from 'zod';

const side = z.number().int().min(1).max(MAX_SPRITE_SIZE);

const requiredMaskSchema = z
  .strictObject({ width: side, height: side, bits: z.instanceof(Uint8Array) })
  .refine((mask) => mask.bits.length === mask.width * mask.height, {
    message: 'bits must hold width * height bytes.',
    path: ['bits'],
  });

export { requiredMaskSchema };
