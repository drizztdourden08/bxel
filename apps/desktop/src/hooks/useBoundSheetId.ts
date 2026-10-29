/* @layer renderer-app @kind hook */
import type { SheetId } from '@bxel/document';
import { useEffect } from 'react';
import { useManagerStore } from '../stores/useManagerStore';
import { useActiveAsset } from './useActiveAsset';
import { sheetIdOfKey } from '../sheet-manager/sheet-id-of-key';
import { sheetIdFor } from '../sheet-manager/sheet-id-for';

const useBoundSheetId = (): SheetId | null => {
  const key = useActiveAsset()?.tab?.key;
  const last = useManagerStore((state) => state.sheetId);
  const own = sheetIdOfKey(key);
  useEffect(() => {
    if (own !== null && own !== last) useManagerStore.getState().patch({ sheetId: own });
  }, [own, last]);
  return sheetIdFor(key, last);
};

export { useBoundSheetId };
