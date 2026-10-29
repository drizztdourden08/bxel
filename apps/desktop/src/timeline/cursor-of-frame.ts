/* @layer renderer-app @kind logic */
import type { AnimFrameId } from '@bxel/document';
import type { PlayPlan } from './play-plan.type';

const cursorOfFrame = (plan: PlayPlan, frameId: AnimFrameId): number => plan.steps.findIndex((step) => step.frameId === frameId);

export { cursorOfFrame };
