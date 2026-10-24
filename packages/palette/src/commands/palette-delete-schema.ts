/* @layer core @kind logic */
import { idSchema } from '@bxel/document/schema';
import { z } from 'zod';

const paletteDeleteSchema = z.strictObject({
  bankId: idSchema('bnk'),
});

export { paletteDeleteSchema };
