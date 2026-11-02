/* @layer renderer-app @kind logic */
import { assetViewKeyOf } from '../asset-view/asset-view-key';
import { currentTab } from '../workspace/current-tab';

const currentViewKey = (): string | null => assetViewKeyOf(currentTab());

export { currentViewKey };
