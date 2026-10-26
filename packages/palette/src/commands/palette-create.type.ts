/* @layer core @kind types */
import type { SwatchColorValue } from '@bxel/document';
import type { z } from 'zod';
import type { paletteCreateSchema } from './palette-create-schema';

type PaletteCreateOptions = z.output<typeof paletteCreateSchema>;

type CheckedBank = { readonly name: string; readonly colors: readonly SwatchColorValue[] };

export type { CheckedBank, PaletteCreateOptions };
