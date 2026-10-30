/* @layer core @kind logic */
import { z } from 'zod';
import { sheetRefSchema } from './sheet-ref-schema';

const spriteReorderSchema = z
  .strictObject({
    to: z.number().int().min(0).optional(),
    by: z.number().int().optional(),
    sheet: sheetRefSchema.optional().describe('Move the sprites inside this sheet only. The order of the file stays as it is.'),
  })
  .refine((value) => (value.to === undefined) !== (value.by === undefined), { message: 'Give either to or by.' });

export { spriteReorderSchema };
