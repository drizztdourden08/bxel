/* @layer renderer-app @kind logic */
import type { AnimFrame } from '@bxel/document';
import { currentFocus } from './current-focus';
import { currentSelection } from './current-selection';
import { selectFrameIds } from './select-frame-ids';
import type { Rule } from './select-frames-where.type';

const matches = (rule: Rule, frame: AnimFrame, spriteIds: ReadonlySet<string | null>, picked: readonly string[]): boolean =>
  rule === 'same-sprite' ? frame.spriteId !== null && spriteIds.has(frame.spriteId) : !picked.includes(frame.id);

const selectFramesWhere = (rule: Rule): boolean => {
  const focus = currentFocus();
  if (!focus) return false;
  const picked = currentSelection(focus);
  const spriteIds = new Set(focus.animation.frames.filter((frame) => picked.includes(frame.id)).map((frame) => frame.spriteId));
  const ids = focus.animation.frames.filter((frame) => matches(rule, frame, spriteIds, picked)).map((frame) => frame.id);
  if (ids.length === 0) return false;
  selectFrameIds(ids, ids.includes(focus.frame.id) ? focus.frame.id : undefined);
  return true;
};

export { selectFramesWhere };
