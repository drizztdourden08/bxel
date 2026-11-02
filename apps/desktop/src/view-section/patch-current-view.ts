/* @layer renderer-app @kind logic */
import type { AssetView } from '../asset-view/asset-view.type';
import { currentViewKey } from '../reference-image/current-view-key';
import { useAssetViewStore } from '../stores/useAssetViewStore';

const patchCurrentView = (patch: Partial<AssetView>): void => {
  const key = currentViewKey();
  if (key !== null) useAssetViewStore.getState().patch(key, patch);
};

export { patchCurrentView };
