/* @layer core @kind logic */
import { z } from 'zod';
import { paletteBankSchema } from './palette-schema';

const paletteFileSchema = z.object({ bank: paletteBankSchema });

export { paletteFileSchema };
