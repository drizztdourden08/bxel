/* @layer renderer-app @kind logic */
import { COMMAND_NAME } from '@bxel/document';
import type { AnimFrameId, CommandStep } from '@bxel/document';
import { animationStep } from './animation-step';
import { idRef } from './id-ref';
import type { AnimationFocus } from './timeline.type';

const orderSteps = (focus: Pick<AnimationFocus, 'animation'>, current: readonly AnimFrameId[], desired: readonly AnimFrameId[]): CommandStep[] => {
  const working = [...current];
  const steps: CommandStep[] = [];
  desired.forEach((id, to) => {
    if (working[to] === id) return;
    working.splice(working.indexOf(id), 1);
    working.splice(to, 0, id);
    steps.push(animationStep(focus, COMMAND_NAME.animationFrameReorder, { frame: idRef(id), to }));
  });
  return steps;
};

export { orderSteps };
