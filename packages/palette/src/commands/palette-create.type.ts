/* @layer core @kind types */
import type { z } from 'zod';
import type { paletteCreateSchema } from './palette-create-schema';

type PaletteCreateOptions = z.output<typeof paletteCreateSchema>;

export type { PaletteCreateOptions };
