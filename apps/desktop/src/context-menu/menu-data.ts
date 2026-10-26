/* @layer renderer-app @kind logic */
import type { ContextMenuContext } from '@drizztdourden08/brock-react';

const menuData = <T extends object>(context: Pick<ContextMenuContext, 'data'>): Partial<T> =>
  typeof context.data === 'object' && context.data !== null ? context.data : {};

export { menuData };
