/* @layer core @kind types */
import type { z } from 'zod';
import type { swatchUpdateSchema } from './swatch-update-schema';

type SwatchUpdateOptions = z.output<typeof swatchUpdateSchema>;

export type { SwatchUpdateOptions };
