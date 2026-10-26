/* @layer renderer-app @kind logic */
import { COMMAND_NAME } from '@bxel/document';
import type { CommandStep, Tileset } from '@bxel/document';
import type { TileLink } from './tile-animation-steps.type';

const setTileStep = (tileset: Tileset, key: number, link: TileLink): CommandStep => ({
  name: COMMAND_NAME.tileAnimation,
  targets: null,
  options: { tileset: tileset.id, key, change: { kind: 'set', animation: link.animation, tag: link.tag, start: link.start } },
});

export { setTileStep };
