/* @layer renderer-app @kind logic */
import type { Artwork } from '@bxel/document';
import { listSprites } from './list-sprites';
import type { SceneInput, SpriteScene } from './sheet.type';

const spriteScene = (artwork: Artwork, input: SceneInput): SpriteScene => {
  const sprites = listSprites(artwork);
  const chosen = new Set(input.selected);
  return {
    sprites,
    active: sprites.find((sprite) => sprite.id === input.activeId) ?? sprites[0] ?? null,
    selected: sprites.filter((sprite) => chosen.has(sprite.id)),
  };
};

export { spriteScene };
