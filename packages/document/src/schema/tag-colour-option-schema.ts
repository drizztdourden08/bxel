/* @layer core @kind logic */
import { z } from 'zod';
import { tagColourSchema } from './tag-colour-schema';

const tagColourOptionSchema = z
  .string()
  .transform((value) => value.toLowerCase())
  .pipe(tagColourSchema);

export { tagColourOptionSchema };
