/* @layer renderer-app @kind types */
import type { AnimFrameId, AnimStep, Animation, TagId } from '@bxel/document';
import type { LoopRange, PlayMode } from '../stores/timeline-store.type';

interface PlayPlan {
  steps: readonly AnimStep[];
  starts: readonly number[];
  cycleMs: number;
}

interface PlanInput {
  animation: Animation;
  tagId: TagId | null;
  picked: readonly AnimFrameId[];
  rangePicked: boolean;
  loopRange: LoopRange | null;
  mode: PlayMode;
  subtags: boolean;
}

interface PlayPosition {
  cursor: number;
  done: boolean;
}

export type { PlanInput, PlayPlan, PlayPosition };
