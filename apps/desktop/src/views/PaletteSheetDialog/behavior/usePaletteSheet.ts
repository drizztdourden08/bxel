/* @layer renderer-app @kind hook */
import { useCallback, useMemo } from 'react';
import type { PaletteTarget } from '../../../editor/editor.type';
import { useCommitPlan } from '../../../hooks/useCommitPlan';
import type { PaletteSheetRequest } from '../../../stores/palette-panel-store.type';
import { currentBank } from '../../../palette-panel/current-bank';
import { followHeld } from '../../../palette-panel/follow-held';
import { sheetPlan } from '../../../palette-panel/sheet-plan';
import { useDocumentStore } from '../../../stores/useDocumentStore';
import { usePaletteSheetStore } from '../../../stores/usePaletteSheetStore';
import { previewError } from '../../../transactions/preview-error';
import type { SheetState } from '../PaletteSheetDialog.type';

const usePaletteSheet = (request: PaletteSheetRequest, target: PaletteTarget): SheetState => {
  const view = useDocumentStore((state) => state.views[request.documentId] ?? null);
  const plan = useMemo(() => (view ? sheetPlan(view.state.artwork, target.bank, target.sprite, request) : null), [view, target, request]);
  const error = useMemo(() => previewError(request.documentId, plan), [plan, request.documentId]);
  const cancel = useCallback(() => usePaletteSheetStore.getState().close(), []);
  const afterCommit = useCallback(() => {
    const after = currentBank(target);
    if (after) followHeld(target.bank, after);
  }, [target]);
  const { failure, apply } = useCommitPlan(request.documentId, plan, { close: cancel, afterCommit });
  return { plan, error, failure, apply, cancel };
};

export { usePaletteSheet };
