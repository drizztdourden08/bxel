/* @layer core @kind logic */
import { z } from 'zod';
import { CONTROL_CHARACTERS, MAX_NAME_LENGTH } from '../model/limits.constants';

const nameSchema = z
  .string()
  .min(1)
  .max(MAX_NAME_LENGTH)
  .refine((value) => !CONTROL_CHARACTERS.test(value), { message: 'A name has printable characters only.' });

export { nameSchema };
