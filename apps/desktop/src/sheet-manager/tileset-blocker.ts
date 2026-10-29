/* @layer renderer-app @kind logic */
import type { Sprite } from '@bxel/document';
import { TILESET_TEXT } from './tileset-text.constants';

const tilesetBlocker = (sprites: readonly Sprite[]): string | null => {
  const [first] = sprites;
  if (!first) return TILESET_TEXT.needSprites;
  if (sprites.some((sprite) => sprite.width !== first.width || sprite.height !== first.height)) return TILESET_TEXT.sameSize;
  if (sprites.some((sprite) => sprite.bankId !== first.bankId)) return TILESET_TEXT.samePalette;
  return null;
};

export { tilesetBlocker };
