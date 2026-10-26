/* @layer renderer-app @kind component */
import { contextMenuHandler, contextMenuZone, focusRegion } from '@drizztdourden08/brock-react';
import { Box, DocumentTabs, Flex } from '@drizztdourden08/tessera';
import { useFileTypePanelStore } from '../../stores/useFileTypePanelStore';
import { useWorkspaceStore } from '../../stores/useWorkspaceStore';
import { closeTab } from '../../workspace/close-tab';
import { activateTab } from '../../workspace/activate-tab';
import { ASSET_TABS_TEXT, TAB_MENU } from './AssetTabs.constants';
import { useAssetTabs } from './behavior/useAssetTabs';
import { useTabsMenu } from './behavior/useTabsMenu';
import './AssetTabs.css';

const AssetTabs = () => {
  const { tabs, activeId } = useAssetTabs();
  useTabsMenu();
  const moveTab = useWorkspaceStore((state) => state.moveTab);
  const adding = useFileTypePanelStore((state) => state.open);
  const show = useFileTypePanelStore((state) => state.show);
  return (
    <Box {...focusRegion(ASSET_TABS_TEXT.label, ASSET_TABS_TEXT.label)}>
      <Flex className="asset-tabs" {...contextMenuZone(TAB_MENU.zone)}>
        <DocumentTabs
          className="asset-tabs__tabs"
          label={ASSET_TABS_TEXT.label}
          tabs={tabs}
          {...(activeId === undefined || adding ? {} : { activeId })}
          onActivate={activateTab}
          onClose={(tabId) => void closeTab(tabId)}
          onMove={moveTab}
          onTabContextMenu={(tabId, event) => contextMenuHandler(TAB_MENU.zone, { tabId })(event)}
          overflowMenu
          onAdd={show}
        />
      </Flex>
    </Box>
  );
};

export { AssetTabs };
