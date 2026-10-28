/* @layer renderer-app @kind logic */
import type { AnimSpanTag, Animation } from '@bxel/document';
import type { ContextMenuEntry } from '@drizztdourden08/brock-react';
import { spanTagOf } from '../../../timeline/span-tag-of';
import { TIMELINE_MENU } from '../TimelinePanel.menu.constants';
import { noTags } from './no-tags';

const selectMenuEntries = (animation: Animation, spans: readonly AnimSpanTag[]): ContextMenuEntry => ({
  label: TIMELINE_MENU.select,
  items: [
    { command: 'timeline.select_all_frames', label: TIMELINE_MENU.selectAll },
    { command: 'timeline.select_same_sprite', label: TIMELINE_MENU.selectSame },
    {
      label: TIMELINE_MENU.selectTagFrames,
      items: spans.length === 0 ? [noTags()] : spans.map((tag) => ({ command: 'tag.select_frames', label: spanTagOf(animation, tag)?.name ?? tag.name, args: { tagId: tag.id } })),
    },
    { command: 'timeline.invert_selection', label: TIMELINE_MENU.invert },
  ],
});

export { selectMenuEntries };
