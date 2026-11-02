/* @layer renderer-app @kind logic */
import { currentViewKey } from '../reference-image/current-view-key';
import { useAssetViewStore } from '../stores/useAssetViewStore';
import { pivotsShown } from './pivots-shown';

const togglePivots = (): void => {
  const key = currentViewKey();
  if (key !== null) useAssetViewStore.getState().patch(key, { pivots: !pivotsShown() });
};

export { togglePivots };
