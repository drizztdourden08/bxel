/* @layer core @kind logic */
import { idSchema } from '@bxel/document/schema';
import { z } from 'zod';

const importBankSchema = z.union([
  z.strictObject({ bankId: idSchema('bnk') }),
  z.strictObject({ ref: z.string().min(1) }),
]);

export { importBankSchema };
