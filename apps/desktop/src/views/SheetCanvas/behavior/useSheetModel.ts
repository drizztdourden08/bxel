/* @layer renderer-app @kind hook */
import { useMemo } from 'react';
import { useBoundSheetId } from '../../../hooks/useBoundSheetId';
import { sheetModel } from '../../../sheet/sheet-model';
import type { SceneModel, SheetModel } from '../../../sheet/sheet.type';

const useSheetModel = (data: SceneModel | null): SheetModel | null => {
  const sheetId = useBoundSheetId();
  const artwork = data?.artwork ?? null;
  const activeId = data?.scene.active?.id ?? null;
  return useMemo(() => (artwork ? sheetModel({ artwork, activeId, sheetId }) : null), [artwork, activeId, sheetId]);
};

export { useSheetModel };
