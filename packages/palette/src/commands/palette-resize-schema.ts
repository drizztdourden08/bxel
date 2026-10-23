/* @layer core @kind logic */
import { idSchema } from '@bxel/document/schema';
import { z } from 'zod';

const paletteResizeSchema = z.strictObject({
  bankId: idSchema('bnk'),
  cap: z.number().int(),
});

export { paletteResizeSchema };
