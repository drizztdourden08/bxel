/* @layer renderer-app @kind logic */
import type { ContextMenuContext } from '@drizztdourden08/brock-react';
import { menuTarget } from '../../../context-menu/menu-target';
import { TIMELINE_MENU } from './timeline-menu.constants';

const rulerFrame = (context: Pick<ContextMenuContext, 'target' | 'point'>): string | undefined => {
  const ruler = menuTarget(context, TIMELINE_MENU.ruler);
  const ticks = ruler ? Array.from(ruler.querySelectorAll<HTMLElement>(TIMELINE_MENU.tick)) : [];
  const under = ticks.find((tick) => {
    const box = tick.getBoundingClientRect();
    return context.point.x >= box.left && context.point.x < box.right;
  });
  return under?.dataset.tickFrame;
};

export { rulerFrame };
