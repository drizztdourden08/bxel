/* @layer core @kind constants */
import { MAX_SPRITE_SIZE } from '@bxel/document';
import { z } from 'zod';
import { base64Length } from '../codec/base64-length';
import { INDEXES_TEXT_MAX } from '../limits/limits.constants';
import { MASK_DESCRIPTOR_SCHEMA } from './mask-descriptor.constants';

const side = z.number().int().min(1).max(MAX_SPRITE_SIZE);

const BASE64_MASK_SCHEMA = z
  .strictObject({
    width: side,
    height: side,
    bits: z.base64().min(4).max(INDEXES_TEXT_MAX),
  })
  .refine((mask) => mask.bits.length === base64Length(mask.width * mask.height), {
    message: 'bits must be the base64 of width * height bytes.',
    path: ['bits'],
  })
  .describe('A selection mask. bits is standard base64 with padding of width * height bytes, row by row: 0 is outside the selection, any other byte is inside.');

const WIRE_MASK_SCHEMA = z.union([BASE64_MASK_SCHEMA, MASK_DESCRIPTOR_SCHEMA]).meta({ id: 'Mask' });

export { WIRE_MASK_SCHEMA };
