/* @layer renderer-app @kind hook */
import { useMemo } from 'react';
import { useActiveDocument } from '../../../hooks/useActiveDocument';
import { useBoundSheetId } from '../../../hooks/useBoundSheetId';
import { useSpriteScene } from '../../../hooks/useSpriteScene';
import { renderSheet } from '../../../sheet/render-sheet';
import { sheetModel } from '../../../sheet/sheet-model';
import { exportResult } from '../../../sheet-manager/export-result';
import { useManagerStore } from '../../../stores/useManagerStore';
import { usePendingStore } from '../../../stores/usePendingStore';
import type { SheetView } from '../SheetCanvas.type';
import { pendingOverrides } from './pending-overrides';

const useSheetView = (): SheetView | null => {
  const data = useSpriteScene();
  const revision = useActiveDocument()?.state.revision ?? 0;
  const outcome = usePendingStore((state) => state.outcome);
  const activeId = data?.scene.active?.id ?? null;
  const artwork = data?.artwork ?? null;
  const sheetId = useBoundSheetId();
  const showExport = useManagerStore((state) => state.showExport);
  const pack = useManagerStore((state) => state.atlas);
  const model = useMemo(() => (artwork ? sheetModel({ artwork, activeId, sheetId }) : null), [artwork, activeId, sheetId]);
  const exported = useMemo(() => {
    const sheet = model?.sheet;
    return showExport && artwork && sheet ? exportResult(artwork, revision, sheet, pack, pack.page) : null;
  }, [showExport, artwork, model?.sheet, revision, pack]);
  const image = useMemo(() => {
    if (exported?.ok) return new ImageData(exported.result.rgba, exported.result.width, exported.result.height);
    if (!artwork || !model) return null;
    const frame = renderSheet(artwork, model, pendingOverrides(outcome, activeId));
    return new ImageData(frame.rgba, frame.width, frame.height);
  }, [exported, artwork, model, outcome, activeId]);
  if (!data || !model || !image) return null;
  return { data, model, image, exported: exported?.ok ? exported.result : null, failure: exported && !exported.ok ? exported.message : null };
};

export { useSheetView };
