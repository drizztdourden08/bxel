/* @layer renderer-app @kind logic */
import { COMMAND_NAME } from '@bxel/document';
import type { SpriteId } from '@bxel/document';
import { runDocument } from '../sheet/run-document';
import { spritesTarget } from '../sheet/sprites-target';
import { TILE_LABEL } from './tilemap.constants';

const renameTile = (spriteId: SpriteId, name: string): boolean =>
  runDocument(TILE_LABEL.renameTile, [{ name: COMMAND_NAME.spriteUpdate, targets: spritesTarget([spriteId]), options: { name: name.trim() } }]) !== null;

export { renameTile };
