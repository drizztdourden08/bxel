/* @layer core @kind logic */
import { MAX_BANK_CAP } from '@bxel/document';
import { idSchema } from '@bxel/document/schema';
import { z } from 'zod';
import { PALETTE_SORT_KEYS } from '../palette-sort.constants';

const paletteSortSchema = z.strictObject({
  bankId: idSchema('bnk'),
  key: z.enum(PALETTE_SORT_KEYS),
  direction: z.enum(['ascending', 'descending']).optional(),
  swatches: z.array(idSchema('sw')).max(MAX_BANK_CAP).optional(),
});

export { paletteSortSchema };
