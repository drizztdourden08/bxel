/* @layer core @kind logic */
import { z } from 'zod';
import { animationSchema } from './animation-schema';
import { exportPresetSchema } from './export-preset-schema';
import { paletteBankSchema } from './palette-schema';
import { spriteShellSchema } from './sprite-schema';

const animationFileSchema = z.object({
  animation: animationSchema,
  sprites: z.array(spriteShellSchema),
  palette: paletteBankSchema,
  presets: z.array(exportPresetSchema),
});

export { animationFileSchema };
