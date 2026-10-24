/* @layer renderer-app @kind logic */
import type { FrameId, Sprite } from '@bxel/document';
import { orderFrames } from './order-frames';
import { tagAt } from './tag-at';
import { tagFrames } from './tag-frames';
import type { PlayOptions } from './timeline.type';

const playSequence = (sprite: Sprite, frameId: FrameId, options: PlayOptions): FrameId[] => {
  const tag = tagAt(sprite, frameId, options.tagId);
  const ids = tag ? tagFrames(sprite, tag) : sprite.frames.map((frame) => frame.id);
  const direction = options.pingPong ? 'pingpong' : (tag?.direction ?? 'forward');
  return orderFrames(ids, direction);
};

export { playSequence };
