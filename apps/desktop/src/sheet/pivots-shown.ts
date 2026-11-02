/* @layer renderer-app @kind logic */
import { ASSET_VIEW_DEFAULTS } from '../asset-view/asset-view.constants';
import { currentViewKey } from '../reference-image/current-view-key';
import { useAssetViewStore } from '../stores/useAssetViewStore';

const pivotsShown = (): boolean => {
  const key = currentViewKey();
  return (key === null ? undefined : useAssetViewStore.getState().views[key]?.pivots) ?? ASSET_VIEW_DEFAULTS.pivots;
};

export { pivotsShown };
