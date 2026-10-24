/* @layer renderer-app @kind hook */
import { useMemo } from 'react';
import { useSpriteScene } from '../../../hooks/useSpriteScene';
import { renderSheet } from '../../../sheet/render-sheet';
import { sheetModel } from '../../../sheet/sheet-model';
import { usePendingStore } from '../../../stores/usePendingStore';
import type { SheetView } from '../SheetCanvas.type';
import { pendingOverrides } from './pending-overrides';

const useSheetView = (): SheetView | null => {
  const data = useSpriteScene();
  const outcome = usePendingStore((state) => state.outcome);
  const activeId = data?.scene.active?.id ?? null;
  const artwork = data?.artwork ?? null;
  const model = useMemo(() => (artwork ? sheetModel({ artwork, activeId }) : null), [artwork, activeId]);
  const image = useMemo(() => {
    if (!artwork || !model) return null;
    const frame = renderSheet(artwork, model, pendingOverrides(outcome, activeId));
    return new ImageData(frame.rgba, frame.width, frame.height);
  }, [artwork, model, outcome, activeId]);
  return data && model && image ? { data, model, image } : null;
};

export { useSheetView };
