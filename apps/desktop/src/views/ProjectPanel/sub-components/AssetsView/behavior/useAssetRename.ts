/* @layer renderer-app @kind hook */
import { useCallback, useState } from 'react';
import type { AssetRow } from '../../../../../asset-list/asset-list.type';
import { renameRow } from '../../../../../asset-list/rename-row';
import type { AssetRename } from './useAssetRename.type';

const useAssetRename = (): AssetRename => {
  const [renaming, setRenaming] = useState<AssetRow | null>(null);
  const [renameError, setError] = useState<string | null>(null);

  const startRename = useCallback((row: AssetRow) => setRenaming(row), []);
  const stopRename = useCallback(() => {
    setRenaming(null);
    setError(null);
  }, []);
  const rename = useCallback(
    (name: string): void => {
      if (renaming === null) return;
      void renameRow(renaming, name).then((outcome) => {
        setError(outcome.ok ? null : outcome.message);
        if (outcome.ok) setRenaming(null);
      });
    },
    [renaming],
  );

  return { renaming, renameError, startRename, stopRename, rename };
};

export { useAssetRename };
