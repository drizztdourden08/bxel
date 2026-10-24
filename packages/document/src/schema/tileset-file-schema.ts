/* @layer core @kind logic */
import { z } from 'zod';
import { paletteBankSchema } from './palette-schema';
import { spriteShellSchema } from './sprite-schema';
import { tilesetSchema } from './tileset-schema';

const tilesetFileSchema = z.object({
  tileset: tilesetSchema,
  sprites: z.array(spriteShellSchema),
  palette: paletteBankSchema,
});

export { tilesetFileSchema };
