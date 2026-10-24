/* @layer renderer-app @kind logic */
import type { Sprite } from '@bxel/document';
import type { CelKey, TimelineSelection } from '../stores/timeline-store.type';
import { spanBetween } from './span-between';

const selectFrames = (sprite: Sprite, previous: TimelineSelection, key: CelKey, extend: boolean): TimelineSelection => {
  const anchor = extend && previous.anchor ? previous.anchor : key;
  return { frames: spanBetween(sprite.frames.map((frame) => frame.id), anchor.frameId, key.frameId), layers: [], anchor };
};

export { selectFrames };
