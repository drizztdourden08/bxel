/* @layer renderer-app @kind logic */
import { flattenFrame } from '@bxel/document';
import type { Sprite } from '@bxel/document';
import { DURATION_BYTES } from './identical.constants';
import type { Orientation } from './identical.type';
import { orientPixels } from './orient-pixels';

const spriteBytes = (sprite: Sprite, orientation: Orientation): Uint8Array => {
  const area = sprite.width * sprite.height;
  const out = new Uint8Array(sprite.frames.length * (DURATION_BYTES + area));
  sprite.frames.forEach((frame, at) => {
    const start = at * (DURATION_BYTES + area);
    new DataView(out.buffer).setUint32(start, frame.durationMs);
    out.set(orientPixels(flattenFrame(sprite, frame.id), sprite, orientation), start + DURATION_BYTES);
  });
  return out;
};

export { spriteBytes };
