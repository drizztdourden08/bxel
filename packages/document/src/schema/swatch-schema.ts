/* @layer core @kind logic */
import { z } from 'zod';
import { ID_PREFIX } from '../ids/id-prefix.constants';
import type { SwatchId } from '../model/ids.type';
import type { Rgb } from '../model/palette.type';
import { RGB_PATTERN } from '../model/transparent.constants';
import { alphaSchema } from './alpha-schema';
import { brandedIdSchema } from './branded-id-schema';
import { nameSchema } from './name-schema';

const rgbSchema = z.custom<Rgb>((value) => typeof value === 'string' && RGB_PATTERN.test(value));

const swatchSchema = z.discriminatedUnion('kind', [
  z.object({ id: brandedIdSchema<SwatchId>(ID_PREFIX.swatch), kind: z.literal('transparent') }),
  z.object({
    id: brandedIdSchema<SwatchId>(ID_PREFIX.swatch),
    kind: z.literal('color'),
    rgb: rgbSchema,
    alpha: alphaSchema.optional(),
    name: nameSchema,
  }),
]);

export { swatchSchema };
