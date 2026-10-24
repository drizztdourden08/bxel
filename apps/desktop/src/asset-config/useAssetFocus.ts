/* @layer renderer-app @kind hook */
import { useMemo } from 'react';
import { useActiveAsset } from '../hooks/useActiveAsset';
import { useActiveDocument } from '../hooks/useActiveDocument';
import type { AssetFocus } from './asset-config.type';

const useAssetFocus = (): AssetFocus | null => {
  const view = useActiveDocument();
  const tab = useActiveAsset()?.tab ?? null;
  return useMemo(
    () => (view && tab ? { documentId: view.state.documentId, key: tab.key, artwork: view.state.artwork, readOnly: view.state.readOnly } : null),
    [view, tab],
  );
};

export { useAssetFocus };
