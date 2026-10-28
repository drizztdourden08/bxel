/* @layer renderer-app @kind logic */
import type { AnimFrameId, Animation } from '@bxel/document';
import type { OnionSettings } from '../stores/timeline-store.type';
import type { OnionLayer, OnionSide, OnionStep } from './onion.type';
import type { OnionPlanOptions, Ring } from './onion-plan.type';
import { onionSteps } from './onion-steps';
import type { PlayPlan } from './play-plan.type';

const pick = (ring: Ring, offset: number): OnionStep | undefined => {
  const { steps, at } = ring;
  const target = at + offset;
  if (ring.wrap) return steps[((target % steps.length) + steps.length) % steps.length];
  return steps[target];
};

const alphaOf = (onion: OnionSettings, step: number, count: number): number =>
  (onion.opacity / 100) * (onion.falloff === 'flat' ? 1 : (count - step) / count);

const spriteOf = (animation: Animation, frameId: AnimFrameId): string | null => animation.frames.find((frame) => frame.id === frameId)?.spriteId ?? null;

const side = (ring: Ring, kind: OnionSide, onion: OnionSettings, skip: (frameId: AnimFrameId) => boolean): OnionLayer[] => {
  const count = kind === 'before' ? onion.before : onion.after;
  const layers: OnionLayer[] = [];
  for (let step = 0; step < count; step += 1) {
    const found = pick(ring, kind === 'before' ? -(step + 1) : step + 1);
    if (found && !skip(found.frameId)) layers.push({ frameId: found.frameId, flip: found.flip, side: kind, alpha: alphaOf(onion, step, count) });
  }
  return layers;
};

const onionPlan = (animation: Animation, frameId: AnimFrameId, plan: PlayPlan, options: OnionPlanOptions): OnionLayer[] => {
  const { onion, mode } = options;
  if (!onion.on) return [];
  const steps = onionSteps(animation, frameId, plan, onion);
  const at = steps.findIndex((step) => step.frameId === frameId);
  if (at < 0) return [];
  const ring: Ring = { steps, at, wrap: onion.wrap && mode !== 'once' && steps.length > 1 };
  const own = spriteOf(animation, frameId);
  const skip = (other: AnimFrameId): boolean => other === frameId || (onion.skipRepeats && own !== null && spriteOf(animation, other) === own);
  return [...side(ring, 'before', onion, skip), ...side(ring, 'after', onion, skip)];
};

export { onionPlan };
