/* @layer core @kind logic */
import { alphaSchema } from '@bxel/document/schema';
import { z } from 'zod';
import { swatchSetIdSchema } from '../ids/swatch-set-id-schema';
import { hasControlCharacters } from '../manifest/has-control-characters';
import { MAX_COLOR_NAME, MAX_SET_COLORS, MAX_SET_NAME, SWATCH_RGB_REGEX } from './swatch.constants';

const printable = (text: string): boolean => !hasControlCharacters(text);

const swatchColorSchema = z.strictObject({
  rgb: z
    .string()
    .regex(SWATCH_RGB_REGEX, { message: 'A colour looks like #1a2b3c.' })
    .transform((value) => value.toLowerCase()),
  alpha: alphaSchema.optional(),
  name: z.string().max(MAX_COLOR_NAME).refine(printable, { message: 'A colour name has printable characters only.' }),
});

const swatchSetSchema = z.strictObject({
  setId: swatchSetIdSchema,
  name: z
    .string()
    .min(1)
    .max(MAX_SET_NAME)
    .refine((text) => text.trim() !== '', { message: 'A set name has at least one visible character.' })
    .refine(printable, { message: 'A set name has printable characters only.' }),
  colors: z.array(swatchColorSchema).min(1).max(MAX_SET_COLORS),
});

export { swatchSetSchema };
