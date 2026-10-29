/* @layer core @kind logic */
import type { Sprite } from '@bxel/document';

const islandMask = (sprite: Sprite): Uint8Array => {
  const mask = new Uint8Array(sprite.width * sprite.height);
  for (const cel of Object.values(sprite.cels)) {
    cel.pixels.forEach((value, at) => {
      if (value !== 0) mask[at] = 1;
    });
  }
  return mask;
};

export { islandMask };
