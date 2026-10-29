/* @layer renderer-app @kind logic */
import { animationSequence } from '@bxel/document';
import type { AnimFrameId, Animation } from '@bxel/document';
import type { OnionSettings } from '../stores/timeline-store.type';
import type { OnionStep } from './onion.type';
import type { PlayPlan } from './play-plan.type';

const whole = (animation: Animation): OnionStep[] => animationSequence(animation, null).steps.map((step) => ({ frameId: step.frameId, flip: step.flip }));

const stripOf = (animation: Animation, allowed: ReadonlySet<AnimFrameId> | null): OnionStep[] =>
  animation.frames.filter((frame) => allowed === null || allowed.has(frame.id)).map((frame) => ({ frameId: frame.id, flip: null }));

const onionSteps = (animation: Animation, frameId: AnimFrameId, plan: PlayPlan, onion: OnionSettings): OnionStep[] => {
  const ranged = onion.scope === 'range' && plan.steps.some((step) => step.frameId === frameId);
  if (onion.order === 'strip') return stripOf(animation, ranged ? new Set(plan.steps.map((step) => step.frameId)) : null);
  return ranged ? plan.steps.map((step) => ({ frameId: step.frameId, flip: step.flip })) : whole(animation);
};

export { onionSteps };
