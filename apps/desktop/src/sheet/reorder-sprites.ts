/* @layer renderer-app @kind logic */
import { COMMAND_NAME } from '@bxel/document';
import type { SpriteId } from '@bxel/document';
import { runDocument } from './run-document';
import { SPRITE_LABEL } from './sprite-label.constants';
import { spritesTarget } from './sprites-target';

const reorderSprites = (ids: readonly SpriteId[], move: { by: number } | { to: number }): void => {
  if (ids.length === 0) return;
  runDocument(SPRITE_LABEL.reorder, [{ name: COMMAND_NAME.spriteReorder, targets: spritesTarget(ids), options: move }]);
};

export { reorderSprites };
