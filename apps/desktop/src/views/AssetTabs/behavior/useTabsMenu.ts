/* @layer renderer-app @kind hook */
import { useContextMenu } from '@drizztdourden08/brock-react';
import type { ContextMenuContext } from '@drizztdourden08/brock-react';
import { useWorkspaceStore } from '../../../stores/useWorkspaceStore';
import { activateTab } from '../../../workspace/activate-tab';
import { TAB_MENU } from '../AssetTabs.constants';
import { tabIdOf } from './tab-id-of';
import { tabMenuEntries } from './tab-menu-entries';

const activateClicked = (context: ContextMenuContext): void => {
  const tabId = tabIdOf(context);
  if (tabId !== undefined && useWorkspaceStore.getState().activeTab !== tabId) activateTab(tabId);
};

const useTabsMenu = (): void => {
  useContextMenu(TAB_MENU.zone, { label: TAB_MENU.label, beforeOpen: activateClicked, entries: tabMenuEntries });
};

export { useTabsMenu };
