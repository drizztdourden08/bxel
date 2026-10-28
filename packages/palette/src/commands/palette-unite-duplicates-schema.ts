/* @layer core @kind logic */
import { idSchema } from '@bxel/document/schema';
import { z } from 'zod';

const paletteUniteDuplicatesSchema = z.strictObject({
  bankId: idSchema('bnk'),
});

export { paletteUniteDuplicatesSchema };
