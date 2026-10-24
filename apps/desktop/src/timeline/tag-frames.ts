/* @layer renderer-app @kind logic */
import type { FrameId, Sprite, Tag } from '@bxel/document';
import { spanBetween } from './span-between';

const tagFrames = (sprite: Sprite, tag: Tag): FrameId[] =>
  spanBetween(sprite.frames.map((frame) => frame.id), tag.from, tag.to);

export { tagFrames };
