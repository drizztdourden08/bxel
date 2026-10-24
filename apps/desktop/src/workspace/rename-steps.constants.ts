/* @layer renderer-app @kind constants */
import { COMMAND_NAME } from '@bxel/document';
import type { AssetKind, CommandStep, SpriteId } from '@bxel/document';
import { PALETTE_COMMAND_NAME } from '@bxel/palette';
import { spritesTarget } from '../sheet/sprites-target';

const RENAME_STEP: Readonly<Partial<Record<AssetKind, (id: string, name: string) => CommandStep>>> = {
  sprite: (id, name) => ({ name: COMMAND_NAME.spriteUpdate, targets: spritesTarget([id as SpriteId]), options: { name } }),
  sheet: (id, name) => ({ name: COMMAND_NAME.sheetUpdate, targets: null, options: { sheet: id, name } }),
  tileset: (id, name) => ({ name: COMMAND_NAME.tilesetUpdate, targets: null, options: { tileset: id, name } }),
  tilemap: (id, name) => ({ name: COMMAND_NAME.tilemapUpdate, targets: null, options: { tilemap: id, name } }),
  palette: (id, name) => ({ name: PALETTE_COMMAND_NAME.paletteUpdate, targets: null, options: { bankId: id, name } }),
};

const RENAME_LABEL = 'Rename';

export { RENAME_LABEL, RENAME_STEP };
