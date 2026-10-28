/* @layer renderer-app @kind logic */
import type { ContextMenuContext } from '@drizztdourden08/brock-react';
import { menuTarget } from '../../../context-menu/menu-target';
import { ITEM_SELECTOR } from '../ProjectPanel.constants';

const menuKeyOf = (context: Pick<ContextMenuContext, 'target' | 'data'>): string | undefined => {
  const data = context.data;
  if (typeof data === 'object' && data !== null && 'key' in data && typeof data.key === 'string') return data.key;
  return menuTarget(context, ITEM_SELECTOR)?.dataset.itemKey;
};

export { menuKeyOf };
