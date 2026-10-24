/* @layer renderer-app @kind logic */
import type { FrameId, Sprite } from '@bxel/document';
import type { OnionSettings } from '../stores/timeline-store.type';
import type { OnionLayer, OnionSide } from './onion.type';

const side = (ids: readonly FrameId[], at: number, kind: OnionSide, onion: OnionSettings): OnionLayer[] => {
  const count = kind === 'before' ? onion.before : onion.after;
  return Array.from({ length: count }, (_, step) => {
    const frameId = ids[kind === 'before' ? at - step - 1 : at + step + 1];
    return frameId === undefined ? [] : [{ frameId, side: kind, alpha: (onion.opacity / 100) * ((count - step) / count) }];
  }).flat();
};

const onionPlan = (sprite: Sprite, frameId: FrameId, onion: OnionSettings): OnionLayer[] => {
  if (!onion.on) return [];
  const ids = sprite.frames.map((frame) => frame.id);
  const at = ids.indexOf(frameId);
  if (at < 0) return [];
  return [...side(ids, at, 'before', onion), ...side(ids, at, 'after', onion)];
};

export { onionPlan };
