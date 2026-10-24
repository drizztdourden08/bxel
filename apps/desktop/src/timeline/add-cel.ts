/* @layer renderer-app @kind logic */
import type { Sprite } from '@bxel/document';
import type { CelKey, TimelineSelection } from '../stores/timeline-store.type';
import type { EffectiveSelection } from './timeline.type';

const addCel = (sprite: Sprite, base: EffectiveSelection, key: CelKey): TimelineSelection => ({
  frames: sprite.frames.map((frame) => frame.id).filter((id) => id === key.frameId || base.frames.includes(id)),
  layers: sprite.layers.map((layer) => layer.id).filter((id) => id === key.layerId || base.layers.includes(id)),
  anchor: key,
});

export { addCel };
