/* @layer renderer-app @kind logic */
import type { Artwork, Sprite } from '@bxel/document';

const spriteOf = (artwork: Artwork, name: string): Sprite => {
  const found = artwork.sprites.find((sprite) => sprite.name === name);
  if (!found) throw new Error(`the artwork has no sprite named ${name}`);
  return found;
};

export { spriteOf };
