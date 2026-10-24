/* @layer renderer-app @kind logic */
import type { Sprite } from '@bxel/document';
import type { CelKey, TimelineSelection } from '../stores/timeline-store.type';
import { spanBetween } from './span-between';

const selectCel = (sprite: Sprite, previous: TimelineSelection, key: CelKey, extend: boolean): TimelineSelection => {
  const anchor = extend && previous.anchor ? previous.anchor : key;
  return {
    frames: spanBetween(sprite.frames.map((frame) => frame.id), anchor.frameId, key.frameId),
    layers: spanBetween(sprite.layers.map((layer) => layer.id), anchor.layerId, key.layerId),
    anchor,
  };
};

export { selectCel };
