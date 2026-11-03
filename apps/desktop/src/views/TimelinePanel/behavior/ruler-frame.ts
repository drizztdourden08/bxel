/* @layer renderer-app @kind logic */
import type { ContextMenuContext } from '@drizztdourden08/brock-react';
import { menuTarget } from '../../../context-menu/menu-target';
import { currentFocus } from '../../../timeline/current-focus';
import { TIMELINE_MENU } from './timeline-menu.constants';

const rulerFrame = (context: Pick<ContextMenuContext, 'target' | 'point'>): string | undefined => {
  const ruler = menuTarget(context, TIMELINE_MENU.ruler);
  if (!ruler) return undefined;
  const x = context.point.x - ruler.getBoundingClientRect().left;
  const index = (ruler.dataset.lefts ?? '').split(',').reduce((found, left, at) => (Number(left) <= x ? at : found), 0);
  return currentFocus()?.animation.frames[index]?.id;
};

export { rulerFrame };
