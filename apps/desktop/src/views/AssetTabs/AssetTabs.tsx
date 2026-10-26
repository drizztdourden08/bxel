/* @layer renderer-app @kind component */
import { focusRegion } from '@drizztdourden08/brock-react';
import { Box, DocumentTabs, Flex } from '@drizztdourden08/tessera';
import { useFileTypePanelStore } from '../../stores/useFileTypePanelStore';
import { useWorkspaceStore } from '../../stores/useWorkspaceStore';
import { closeTab } from '../../workspace/close-tab';
import { focusTab } from '../../workspace/focus-tab';
import { ASSET_TABS_TEXT } from './AssetTabs.constants';
import { useAssetTabs } from './behavior/useAssetTabs';
import './AssetTabs.css';

const activate = (tabId: string): void => {
  useFileTypePanelStore.getState().hide();
  const tab = useWorkspaceStore.getState().tabs.find((each) => each.id === tabId);
  if (tab) focusTab(tab);
};

const AssetTabs = () => {
  const { tabs, activeId } = useAssetTabs();
  const moveTab = useWorkspaceStore((state) => state.moveTab);
  const adding = useFileTypePanelStore((state) => state.open);
  const show = useFileTypePanelStore((state) => state.show);
  return (
    <Box {...focusRegion(ASSET_TABS_TEXT.label, ASSET_TABS_TEXT.label)}>
      <Flex className="asset-tabs">
        <DocumentTabs
          className="asset-tabs__tabs"
          label={ASSET_TABS_TEXT.label}
          tabs={tabs}
          {...(activeId === undefined || adding ? {} : { activeId })}
          onActivate={activate}
          onClose={(tabId) => void closeTab(tabId)}
          onMove={moveTab}
          overflowMenu
          onAdd={show}
        />
      </Flex>
    </Box>
  );
};

export { AssetTabs };
