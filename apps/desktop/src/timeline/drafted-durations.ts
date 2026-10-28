/* @layer renderer-app @kind logic */
import type { DraftedFrames, DurationDraft } from './duration-draft.type';

const draftedDurations = (frames: DraftedFrames, draft: DurationDraft | null): number[] =>
  frames.map((frame) => {
    if (!draft || !draft.ids.includes(frame.id)) return frame.durationMs;
    return draft.ids.length > 1 ? Math.max(1, Math.round(frame.durationMs * draft.factor)) : draft.ms;
  });

export { draftedDurations };
