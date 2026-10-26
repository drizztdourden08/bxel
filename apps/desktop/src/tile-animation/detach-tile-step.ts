/* @layer renderer-app @kind logic */
import { COMMAND_NAME } from '@bxel/document';
import type { CommandStep, Tileset } from '@bxel/document';

const detachTileStep = (tileset: Tileset, key: number): CommandStep => ({
  name: COMMAND_NAME.tileAnimation,
  targets: null,
  options: { tileset: tileset.id, key, change: { kind: 'clear' } },
});

export { detachTileStep };
