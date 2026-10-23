/* @layer core @kind logic */
import { z } from 'zod';
import { ID_PREFIX } from '../ids/id-prefix.constants';
import type { BankId, ProjectId, SpriteId } from '../model/ids.type';
import { brandedIdSchema } from './branded-id-schema';
import { exportPresetSchema } from './export-preset-schema';
import { nameSchema } from './name-schema';
import { paletteBankSchema } from './palette-schema';
import { sheetSchema } from './sheet-schema';
import { spriteShellSchema } from './sprite-schema';
import { tilemapShellSchema } from './tilemap-schema';
import { tilesetSchema } from './tileset-schema';

const projectSchema = z.object({
  id: brandedIdSchema<ProjectId>(ID_PREFIX.project),
  name: nameSchema,
  defaultBankId: brandedIdSchema<BankId>(ID_PREFIX.bank),
  coverSpriteId: brandedIdSchema<SpriteId>(ID_PREFIX.sprite).nullable(),
  banks: z.array(paletteBankSchema),
  sprites: z.array(spriteShellSchema),
  sheets: z.array(sheetSchema),
  presets: z.array(exportPresetSchema),
  tilesets: z.array(tilesetSchema),
  tilemaps: z.array(tilemapShellSchema),
});

export { projectSchema };
