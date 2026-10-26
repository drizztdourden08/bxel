/* @layer renderer-app @kind logic */
import type { AssetRow } from '../asset-list/asset-list.type';
import { openRow } from '../asset-list/open-row';
import { openAssetSettings } from '../config-entry/open-asset-settings';

const openInAssetSettings = (row: AssetRow): void => {
  openRow(row);
  openAssetSettings('overview');
};

export { openInAssetSettings };
