/* @layer renderer-app @kind logic */
import { nav } from '@drizztdourden08/brock-react';
import { currentTab } from '../workspace/current-tab';
import { ASSET_PAGES, PROPERTIES_HUB } from './config-entry.constants';
import type { AssetSection } from './config-entry.type';

const openAssetSettings = (section: AssetSection = 'main'): void => {
  const tab = currentTab();
  nav.open(tab === null ? PROPERTIES_HUB : `${PROPERTIES_HUB}/${ASSET_PAGES[tab.key.kind][section]}`);
};

export { openAssetSettings };
