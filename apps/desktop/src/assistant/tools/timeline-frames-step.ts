/* @layer renderer-app @kind logic */
import type { AnimFrameId, TagId } from '@bxel/document';
import { useTimelineStore } from '../../stores/useTimelineStore';
import { selectTag } from '../../timeline/select-tag';
import type { AnimationFocus } from '../../timeline/timeline.type';
import type { TimelinePatch } from './timeline-patch.type';

const applyRange = (range: NonNullable<TimelinePatch['range']>): void => {
  const timeline = useTimelineStore.getState();
  if (range.kind === 'picked') timeline.setRangePicked();
  else if (range.kind === 'tag') selectTag(range.tagId as TagId);
  else timeline.selectTag(null);
  if (range.kind === 'loop') timeline.setLoopRange({ from: range.from as AnimFrameId, to: range.to as AnimFrameId });
};

const applyPick = (ids: readonly string[], focus: AnimationFocus, playhead: AnimFrameId | undefined): void => {
  const timeline = useTimelineStore.getState();
  const frames = focus.animation.frames.filter((frame) => ids.includes(frame.id)).map((frame) => frame.id);
  const held = timeline.frameId !== null && frames.includes(timeline.frameId) ? timeline.frameId : (frames[0] ?? timeline.frameId);
  timeline.select({ frames, anchor: frames[0] ?? null }, playhead ?? held);
};

const timelineFramesStep = (patch: TimelinePatch, focus: AnimationFocus): void => {
  if (patch.range !== undefined) applyRange(patch.range);
  if (patch.pickedFrameIds !== undefined) applyPick(patch.pickedFrameIds, focus, patch.frameId as AnimFrameId | undefined);
  if (patch.frameId !== undefined) useTimelineStore.getState().setPlayhead(patch.frameId as AnimFrameId);
};

export { timelineFramesStep };
