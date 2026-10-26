/* @layer renderer-app @kind logic */
import type { ContextMenuContext } from '@drizztdourden08/brock-react';

const menuTarget = (context: Pick<ContextMenuContext, 'target'>, selector: string): HTMLElement | null =>
  context.target instanceof Element ? context.target.closest<HTMLElement>(selector) : null;

export { menuTarget };
