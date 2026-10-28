/* @layer renderer-app @kind logic */
import { currentTab } from '../workspace/current-tab';
import { keyId } from '../workspace/key-id';
import type { OpenTab } from '../workspace/workspace.type';

const assetViewKeyOf = (tab: OpenTab | null): string | null => (tab ? `${tab.documentId}/${keyId(tab.key)}` : null);

const currentAssetViewKey = (): string | null => assetViewKeyOf(currentTab());

export { assetViewKeyOf, currentAssetViewKey };
