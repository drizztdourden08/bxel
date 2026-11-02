/* @layer renderer-app @kind logic */
import { currentViewKey } from '../reference-image/current-view-key';
import { useAssetViewStore } from '../stores/useAssetViewStore';

const clearGuideColours = (): void => {
  const key = currentViewKey();
  if (key !== null) useAssetViewStore.getState().patch(key, { guideColours: {} });
};

export { clearGuideColours };
