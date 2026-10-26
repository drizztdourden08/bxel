/* @layer renderer-app @kind logic */
import type { ContextMenuContext } from '@drizztdourden08/brock-react';
import type { SymmetryAxis } from '../../../stores/tool-store.type';

const rulerAlong = (axis: SymmetryAxis, context: ContextMenuContext, fallback: number): number => {
  const rect = context.target instanceof Element ? context.target.closest('[data-context-menu]')?.getBoundingClientRect() : undefined;
  if (!rect) return fallback;
  return axis === 'x' ? context.point.x - rect.left : context.point.y - rect.top;
};

export { rulerAlong };
