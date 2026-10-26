/* @layer core @kind types */
import type { AnimFlip } from '../model/animation.type';
import type { AnimFrameId } from '../model/ids.type';

type AnimStep = {
  readonly index: number;
  readonly frameId: AnimFrameId;
  readonly durationMs: number;
  readonly flip: AnimFlip | null;
};

type AnimSequence = {
  readonly steps: readonly AnimStep[];
  readonly repeat: number;
  readonly cycleMs: number;
};

export type { AnimSequence, AnimStep };
