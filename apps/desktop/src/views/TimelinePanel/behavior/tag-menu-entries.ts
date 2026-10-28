/* @layer renderer-app @kind logic */
import type { AnimSpanTag } from '@bxel/document';
import type { ContextMenuEntry } from '@drizztdourden08/brock-react';
import { TIMELINE_MENU } from '../TimelinePanel.menu.constants';
import { noTags } from './no-tags';

const tagMenuEntries = (spans: readonly AnimSpanTag[]): ContextMenuEntry => ({
  label: TIMELINE_MENU.tagMenu,
  items: [
    { command: 'timeline.add_tag', label: TIMELINE_MENU.addTag },
    {
      label: TIMELINE_MENU.addToTag,
      items: spans.length === 0 ? [noTags()] : spans.map((tag) => ({ command: 'tag.include_frames', label: tag.name, args: { tagId: tag.id } })),
    },
    {
      label: TIMELINE_MENU.removeFromTag,
      items: spans.length === 0 ? [noTags()] : spans.map((tag) => ({ command: 'tag.exclude_frames', label: tag.name, args: { tagId: tag.id } })),
    },
  ],
});

export { tagMenuEntries };
