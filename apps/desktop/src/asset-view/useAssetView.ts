/* @layer renderer-app @kind hook */
import { useMemo } from 'react';
import { useActiveAsset } from '../hooks/useActiveAsset';
import { useAssetViewStore } from '../stores/useAssetViewStore';
import { assetViewKeyOf } from './asset-view-key';
import { ASSET_VIEW_DEFAULTS } from './asset-view.constants';
import type { AssetViewModel } from './useAssetView.type';

const useAssetView = (): AssetViewModel => {
  const tab = useActiveAsset()?.tab ?? null;
  const key = assetViewKeyOf(tab);
  const own = useAssetViewStore((state) => (key === null ? undefined : state.views[key]));
  return useMemo(
    () => ({
      key,
      view: { ...ASSET_VIEW_DEFAULTS, ...own },
      patch: (patch) => key !== null && useAssetViewStore.getState().patch(key, patch),
      reset: () => key !== null && useAssetViewStore.getState().reset(key),
    }),
    [key, own],
  );
};

export { useAssetView };
