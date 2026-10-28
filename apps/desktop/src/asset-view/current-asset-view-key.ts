/* @layer renderer-app @kind logic */
import { currentTab } from '../workspace/current-tab';
import { assetViewKeyOf } from './asset-view-key';

const currentAssetViewKey = (): string | null => assetViewKeyOf(currentTab());

export { currentAssetViewKey };
