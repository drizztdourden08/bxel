/* @layer renderer-app @kind logic */
import type { AnimFrameId, Animation, TagId } from '@bxel/document';
import type { OnionSettings } from '../stores/timeline-store.type';
import type { OnionAround, OnionLayer, OnionSide } from './onion.type';
import { playSteps } from './play-steps';
import type { PlayStep } from './timeline.type';

const side = (steps: readonly PlayStep[], at: number, kind: OnionSide, around: OnionAround): OnionLayer[] => {
  const { onion, shown } = around;
  const count = kind === 'before' ? onion.before : onion.after;
  return Array.from({ length: count }, (_, step) => {
    const found = steps[kind === 'before' ? at - step - 1 : at + step + 1];
    if (!found || found.frameId === shown) return [];
    return [{ frameId: found.frameId, flip: found.flip, side: kind, alpha: (onion.opacity / 100) * ((count - step) / count) }];
  }).flat();
};

const onionPlan = (animation: Animation, frameId: AnimFrameId, tagId: TagId | null, onion: OnionSettings): OnionLayer[] => {
  if (!onion.on) return [];
  const inTag = playSteps(animation, tagId).steps;
  const steps = inTag.some((step) => step.frameId === frameId) ? inTag : playSteps(animation, null).steps;
  const at = steps.findIndex((step) => step.frameId === frameId);
  if (at < 0) return [];
  const around = { onion, shown: frameId };
  return [...side(steps, at, 'before', around), ...side(steps, at, 'after', around)];
};

export { onionPlan };
