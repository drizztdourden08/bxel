/* @layer core @kind logic */
import { z } from 'zod';
import { exportPresetSchema } from './export-preset-schema';
import { paletteBankSchema } from './palette-schema';
import { spriteShellSchema } from './sprite-schema';

const spriteFileSchema = z.object({
  sprite: spriteShellSchema,
  palette: paletteBankSchema,
  presets: z.array(exportPresetSchema),
});

export { spriteFileSchema };
