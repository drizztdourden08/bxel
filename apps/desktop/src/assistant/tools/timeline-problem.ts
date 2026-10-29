/* @layer renderer-app @kind logic */
import type { AnimationFocus } from '../../timeline/timeline.type';
import { APP_TOOL_TEXT } from './app-tool.constants';
import type { TimelinePatch } from './timeline-patch.type';

const idsOf = (patch: TimelinePatch): readonly string[] => {
  const { range } = patch;
  const named = range?.kind === 'loop' ? [range.from, range.to] : [];
  return [...(patch.frameId === undefined ? [] : [patch.frameId]), ...(patch.pickedFrameIds ?? []), ...named];
};

const tagProblem = (patch: TimelinePatch, focus: AnimationFocus): boolean => {
  const { range } = patch;
  return range?.kind === 'tag' && !focus.animation.tags.some((tag) => tag.kind === 'span' && tag.id === range.tagId);
};

const timelineProblem = (patch: TimelinePatch, focus: AnimationFocus): { message: string; path: string } | null => {
  const known = new Set<string>(focus.animation.frames.map((frame) => frame.id));
  if (idsOf(patch).some((id) => !known.has(id))) return { message: APP_TOOL_TEXT.timelineNoFrame, path: 'timeline' };
  if (tagProblem(patch, focus)) return { message: APP_TOOL_TEXT.timelineNoTag, path: 'timeline.range' };
  return null;
};

export { timelineProblem };
