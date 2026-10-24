/* @layer renderer-app @kind logic */
import type { FrameId, LayerId, Sprite } from '@bxel/document';
import type { CelKey, TimelineSelection } from '../stores/timeline-store.type';

const addFramePick = (sprite: Sprite, frames: readonly FrameId[], layers: readonly LayerId[], key: CelKey): TimelineSelection => ({
  frames: sprite.frames.map((frame) => frame.id).filter((id) => id === key.frameId || frames.includes(id)),
  layers,
  anchor: key,
});

export { addFramePick };
