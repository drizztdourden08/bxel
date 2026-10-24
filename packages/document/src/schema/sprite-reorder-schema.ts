/* @layer core @kind logic */
import { z } from 'zod';

const spriteReorderSchema = z
  .strictObject({ to: z.number().int().min(0).optional(), by: z.number().int().optional() })
  .refine((value) => (value.to === undefined) !== (value.by === undefined), { message: 'Give either to or by.' });

export { spriteReorderSchema };
