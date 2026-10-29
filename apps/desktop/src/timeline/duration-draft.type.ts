/* @layer renderer-app @kind types */
import type { AnimFrame, AnimFrameId } from '@bxel/document';

interface DurationDraft {
  ids: readonly AnimFrameId[];
  lead: AnimFrameId;
  ms: number;
  factor: number;
}

type DraftedFrames = readonly Pick<AnimFrame, 'id' | 'durationMs'>[];

export type { DraftedFrames, DurationDraft };
