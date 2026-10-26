/* @layer renderer-app @kind logic */
import type { ContextMenuContext } from '@drizztdourden08/brock-react';
import type { TabArgs } from '../../../context-menu/menu-args.type';
import { menuData } from '../../../context-menu/menu-data';
import { menuTarget } from '../../../context-menu/menu-target';
import { TAB_MENU } from '../AssetTabs.constants';

const tabIdOf = (context: ContextMenuContext): string | undefined =>
  menuData<TabArgs>(context).tabId ?? menuTarget(context, TAB_MENU.tab)?.dataset.reorderKey;

export { tabIdOf };
