/* @layer renderer-app @kind hook */
import { useMemo } from 'react';
import { renderSheet } from '../../../sheet/render-sheet';
import type { ExportOutcome } from '../../../sheet-manager/export-result.type';
import type { SceneModel, SheetModel } from '../../../sheet/sheet.type';
import { usePendingStore } from '../../../stores/usePendingStore';
import { pendingOverrides } from './pending-overrides';

const useSheetImage = (data: SceneModel | null, model: SheetModel | null, exported: ExportOutcome | null): ImageData | null => {
  const outcome = usePendingStore((state) => state.outcome);
  const artwork = data?.artwork ?? null;
  const activeId = data?.scene.active?.id ?? null;
  return useMemo(() => {
    if (exported?.ok) return new ImageData(exported.result.rgba, exported.result.width, exported.result.height);
    if (!artwork || !model) return null;
    const frame = renderSheet(artwork, model, pendingOverrides(outcome, activeId));
    return new ImageData(frame.rgba, frame.width, frame.height);
  }, [exported, artwork, model, outcome, activeId]);
};

export { useSheetImage };
