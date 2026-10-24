/* @layer renderer-app @kind logic */
import { flattenFrame } from '@bxel/document';
import type { Sprite } from '@bxel/document';

const flatIndices = (sprite: Sprite, frameAt = 0): Uint8Array => {
  const frame = sprite.frames[frameAt];
  if (!frame) throw new Error(`the sprite has no frame ${frameAt}`);
  return flattenFrame(sprite, frame.id);
};

export { flatIndices };
