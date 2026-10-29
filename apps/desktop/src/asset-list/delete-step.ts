/* @layer renderer-app @kind logic */
import { COMMAND_NAME } from '@bxel/document';
import type { AssetKey, CommandStep, SpriteId } from '@bxel/document';
import { PALETTE_COMMAND_NAME } from '@bxel/palette';
import { spritesTarget } from '../sheet/sprites-target';

const deleteStep = (key: AssetKey): CommandStep | null => {
  if (key.kind === 'sprite') return { name: COMMAND_NAME.spriteDelete, targets: spritesTarget([key.id as SpriteId]), options: {} };
  if (key.kind === 'sheet') return { name: COMMAND_NAME.sheetDelete, targets: null, options: { sheet: key.id } };
  if (key.kind === 'tileset') return { name: COMMAND_NAME.tilesetDelete, targets: null, options: { tileset: key.id } };
  if (key.kind === 'tilemap') return { name: COMMAND_NAME.tilemapDelete, targets: null, options: { tilemap: key.id } };
  return key.kind === 'palette' ? { name: PALETTE_COMMAND_NAME.paletteDelete, targets: null, options: { bankId: key.id } } : null;
};

export { deleteStep };
