/* @layer core @kind logic */
import { MAX_BANK_CAP } from '@bxel/document';
import { idSchema } from '@bxel/document/schema';
import { z } from 'zod';
import { PALETTE_IMPORT_MODES } from './palette-import-mode.constants';

const paletteImportSchema = z.strictObject({
  bankId: idSchema('bnk'),
  colors: z.array(z.string()).max(MAX_BANK_CAP),
  mode: z.enum(PALETTE_IMPORT_MODES).default('append'),
});

export { paletteImportSchema };
