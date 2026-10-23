/* @layer core @kind logic */
import { MAX_BANK_CAP } from '@bxel/document';
import { idSchema } from '@bxel/document/schema';
import { z } from 'zod';

const paletteReorderSchema = z.strictObject({
  bankId: idSchema('bnk'),
  order: z.array(idSchema('sw')).max(MAX_BANK_CAP),
});

export { paletteReorderSchema };
