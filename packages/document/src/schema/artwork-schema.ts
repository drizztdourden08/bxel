/* @layer core @kind logic */
import { z } from 'zod';
import { ID_PREFIX } from '../ids/id-prefix.constants';
import type { BankId, ArtworkId, SpriteId } from '../model/ids.type';
import { brandedIdSchema } from './branded-id-schema';
import { exportPresetSchema } from './export-preset-schema';
import { nameSchema } from './name-schema';
import { paletteBankSchema } from './palette-schema';
import { platformIdSchema } from './platform-id-schema';
import { sheetSchema } from './sheet-schema';
import { spriteShellSchema } from './sprite-schema';
import { tilemapShellSchema } from './tilemap-schema';
import { tilesetSchema } from './tileset-schema';

const artworkSchema = z.object({
  id: brandedIdSchema<ArtworkId>(ID_PREFIX.artwork),
  name: nameSchema,
  defaultBankId: brandedIdSchema<BankId>(ID_PREFIX.bank),
  coverSpriteId: brandedIdSchema<SpriteId>(ID_PREFIX.sprite).nullable(),
  platformId: platformIdSchema.optional(),
  platformStrict: z.boolean().optional(),
  banks: z.array(paletteBankSchema),
  sprites: z.array(spriteShellSchema),
  sheets: z.array(sheetSchema),
  presets: z.array(exportPresetSchema),
  tilesets: z.array(tilesetSchema),
  tilemaps: z.array(tilemapShellSchema),
});

export { artworkSchema };
