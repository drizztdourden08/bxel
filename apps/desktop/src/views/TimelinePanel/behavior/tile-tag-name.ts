/* @layer renderer-app @kind logic */
import type { Animation, TagId } from '@bxel/document';
import { TIMELINE_PANEL_TEXT } from '../TimelinePanel.constants';

const tileTagName = (animation: Animation, tagId: TagId | null): string => {
  const spanTag = animation.tags.find((tag) => tag.id === tagId);
  return spanTag?.kind === 'span' ? TIMELINE_PANEL_TEXT.tileTag(spanTag.name) : TIMELINE_PANEL_TEXT.tileWhole;
};

export { tileTagName };
