/* @layer renderer-app @kind logic */
import type { Sprite } from '@bxel/document';
import type { CelKey, TimelineSelection } from '../stores/timeline-store.type';
import type { EffectiveSelection } from './timeline.type';

const effectiveSelection = (sprite: Sprite, selection: TimelineSelection, current: CelKey): EffectiveSelection => {
  const frames = sprite.frames.filter((frame) => selection.frames.includes(frame.id)).map((frame) => frame.id);
  if (frames.length === 0) return { frames: [current.frameId], layers: [current.layerId] };
  const chosen = sprite.layers.filter((layer) => selection.layers.includes(layer.id)).map((layer) => layer.id);
  return { frames, layers: chosen.length > 0 ? chosen : sprite.layers.map((layer) => layer.id) };
};

export { effectiveSelection };
