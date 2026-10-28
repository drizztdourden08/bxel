/* @layer renderer-app @kind logic */
import type { TagBar } from '../../../timeline/timeline.type';
import type { TrackLayout } from '../../../timeline/track-layout.type';
import type { TagDraft } from './useTagDrag.type';

const tagBarBox = (bar: TagBar, layout: TrackLayout, draft: TagDraft | null): { left: number; width: number } => {
  const start = draft?.start ?? bar.start;
  const end = draft?.end ?? bar.end;
  const left = layout.lefts[start] ?? 0;
  return { left, width: (layout.lefts[end] ?? 0) + (layout.widths[end] ?? 0) - left };
};

export { tagBarBox };
