/* @layer renderer-app @kind hook */
import { useMemo } from 'react';
import { useActiveDocument } from '../../../hooks/useActiveDocument';
import { exportResult } from '../../../sheet-manager/export-result';
import type { ExportOutcome } from '../../../sheet-manager/export-result.type';
import type { SceneModel, SheetModel } from '../../../sheet/sheet.type';
import { useManagerStore } from '../../../stores/useManagerStore';

const useSheetExport = (data: SceneModel | null, model: SheetModel | null): ExportOutcome | null => {
  const revision = useActiveDocument()?.state.revision ?? 0;
  const showExport = useManagerStore((state) => state.showExport);
  const pack = useManagerStore((state) => state.atlas);
  const artwork = data?.artwork ?? null;
  const sheet = model?.sheet;
  return useMemo(() => (showExport && artwork && sheet ? exportResult(artwork, revision, sheet, pack) : null), [showExport, artwork, sheet, revision, pack]);
};

export { useSheetExport };
