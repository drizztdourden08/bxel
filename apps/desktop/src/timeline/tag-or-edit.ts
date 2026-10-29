/* @layer renderer-app @kind logic */
import { useTimelineStore } from '../stores/useTimelineStore';
import { addTag } from './add-tag';
import { currentFocus } from './current-focus';
import { currentSelection } from './current-selection';
import { spanTagOf } from './span-tag-of';
import { tagById } from './tag-by-id';

const tagOrEdit = (): void => {
  const focus = currentFocus();
  const state = useTimelineStore.getState();
  const tag = focus ? spanTagOf(focus.animation, tagById(focus.animation, state.tagId)) : undefined;
  if (focus && tag) {
    const order = focus.animation.frames.map((frame) => frame.id);
    const inside = currentSelection(focus).every((id) => order.indexOf(id) >= order.indexOf(tag.from) && order.indexOf(id) <= order.indexOf(tag.to));
    if (inside) {
      state.setPopover({ kind: 'tag', tagId: tag.id });
      return;
    }
  }
  addTag();
};

export { tagOrEdit };
