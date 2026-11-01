/* @layer renderer-app @kind hook */
import { toast } from '@drizztdourden08/brock-react';
import { useCallback, useMemo, useState } from 'react';
import type { PaletteTarget } from '../../../editor/editor.type';
import type { PaletteSheetRequest } from '../../../stores/palette-panel-store.type';
import { currentBank } from '../../../palette-panel/current-bank';
import { followHeld } from '../../../palette-panel/follow-held';
import { sheetPlan } from '../../../palette-panel/sheet-plan';
import { useDocumentStore } from '../../../stores/useDocumentStore';
import { usePaletteSheetStore } from '../../../stores/usePaletteSheetStore';
import { commitPlan } from '../../../transactions/commit-plan';
import { previewError } from '../../../transactions/preview-error';
import type { SheetState } from '../PaletteSheetDialog.type';

const usePaletteSheet = (request: PaletteSheetRequest, target: PaletteTarget): SheetState => {
  const view = useDocumentStore((state) => state.views[request.documentId] ?? null);
  const [failure, setFailure] = useState<string | null>(null);
  const plan = useMemo(() => (view ? sheetPlan(view.state.artwork, target.bank, target.sprite, request) : null), [view, target, request]);
  const error = useMemo(() => previewError(request.documentId, plan), [plan, request.documentId]);
  const cancel = useCallback(() => usePaletteSheetStore.getState().close(), []);
  const apply = useCallback(() => {
    if (!plan) return;
    const message = commitPlan(request.documentId, plan);
    if (message !== null) {
      setFailure(message);
      return;
    }
    const after = currentBank(target);
    if (after) followHeld(target.bank, after);
    toast(plan.done, { variant: 'success' });
    usePaletteSheetStore.getState().close();
  }, [plan, request.documentId, target]);
  return { plan, error, failure, apply, cancel };
};

export { usePaletteSheet };
