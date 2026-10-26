/* @layer renderer-app @kind logic */
import type { Sprite } from '@bxel/document';
import type { ContextMenuContext } from '@drizztdourden08/brock-react';
import { menuTarget } from '../../../context-menu/menu-target';
import { TIMELINE_MENU } from '../TimelinePanel.constants';
import type { TimelineClicked } from './timeline-clicked.type';

const timelineClicked = (context: ContextMenuContext, sprite: Sprite): TimelineClicked => {
  const find = (selector: string): HTMLElement | null => menuTarget(context, selector);
  const tag = find(TIMELINE_MENU.tag);
  if (tag) return { kind: 'tag', tag: sprite.tags.find((each) => each.id === tag.dataset.tagId) };
  const cel = find(TIMELINE_MENU.cel);
  if (cel) {
    return { kind: 'cel', layer: sprite.layers.find((each) => each.id === cel.dataset.layerId), frame: sprite.frames.find((each) => each.id === cel.dataset.frameId) };
  }
  const head = find(TIMELINE_MENU.head);
  if (head) return { kind: 'head', frame: sprite.frames.find((each) => each.id === head.dataset.frameId) };
  const label = find(TIMELINE_MENU.rowLabel);
  return label ? { kind: 'label', layer: sprite.layers.find((each) => each.id === label.dataset.layerId) } : { kind: 'none' };
};

export { timelineClicked };
