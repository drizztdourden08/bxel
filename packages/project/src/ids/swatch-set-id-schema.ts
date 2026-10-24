/* @layer core @kind logic */
import { z } from 'zod';
import { isSwatchSetId } from './is-swatch-set-id';
import type { SwatchSetId } from './id.type';

const swatchSetIdSchema = z.custom<SwatchSetId>(isSwatchSetId, { message: 'A swatch set id looks like sws_4k7m2q9x1v3d.' });

export { swatchSetIdSchema };
