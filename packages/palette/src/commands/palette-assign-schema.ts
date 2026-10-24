/* @layer core @kind logic */
import { MAX_BANK_CAP } from '@bxel/document';
import { idSchema } from '@bxel/document/schema';
import { z } from 'zod';

const pairSchema = z.strictObject({
  from: idSchema('sw'),
  to: idSchema('sw'),
});

const paletteAssignSchema = z.strictObject({
  bankId: idSchema('bnk'),
  mapping: z.array(pairSchema).max(MAX_BANK_CAP).default([]),
});

export { paletteAssignSchema };
