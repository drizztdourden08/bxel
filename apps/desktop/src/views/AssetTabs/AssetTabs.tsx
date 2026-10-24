/* @layer renderer-app @kind component */
import { DocumentTabs } from '@drizztdourden08/tessera';
import { useWorkspaceStore } from '../../stores/useWorkspaceStore';
import { closeTab } from '../../workspace/close-tab';
import { focusTab } from '../../workspace/focus-tab';
import { ASSET_TABS_TEXT } from './AssetTabs.constants';
import { useAssetTabs } from './behavior/useAssetTabs';

const activate = (tabId: string): void => {
  const tab = useWorkspaceStore.getState().tabs.find((each) => each.id === tabId);
  if (tab) focusTab(tab);
};

const AssetTabs = () => {
  const { tabs, activeId } = useAssetTabs();
  const moveTab = useWorkspaceStore((state) => state.moveTab);
  if (tabs.length === 0) return null;
  return (
    <DocumentTabs
      label={ASSET_TABS_TEXT.label}
      tabs={tabs}
      {...(activeId === undefined ? {} : { activeId })}
      onActivate={activate}
      onClose={(tabId) => void closeTab(tabId)}
      onMove={moveTab}
      overflowMenu
    />
  );
};

export { AssetTabs };
