/* @layer renderer-app @kind hook */
import { toast } from '@drizztdourden08/brock-react';
import { useCallback, useMemo, useState } from 'react';
import type { EditorTarget } from '../../../editor/editor.type';
import type { PaletteSheetRequest } from '../../../stores/palette-panel-store.type';
import { currentBank } from '../../../palette-panel/current-bank';
import { followHeld } from '../../../palette-panel/follow-held';
import { sheetPlan } from '../../../palette-panel/sheet-plan';
import { useDocumentStore } from '../../../stores/useDocumentStore';
import { usePaletteSheetStore } from '../../../stores/usePaletteSheetStore';
import { runSteps } from '../../../transactions/run-steps';
import { stepRequest } from '../../../transactions/step-request';
import type { SheetState } from '../PaletteSheetDialog.type';

const usePaletteSheet = (request: PaletteSheetRequest, target: EditorTarget): SheetState => {
  const view = useDocumentStore((state) => state.views[request.documentId] ?? null);
  const [failure, setFailure] = useState<string | null>(null);
  const plan = useMemo(() => (view ? sheetPlan(view.state.artwork, target.bank, target.sprite, request) : null), [view, target, request]);
  const error = useMemo(() => {
    if (!plan || plan.steps.length === 0) return null;
    const { host } = useDocumentStore.getState();
    const check = host.execute({ ...stepRequest(host, request.documentId, plan.label, plan.steps), mode: 'preview' });
    return check.ok ? null : check.error.message;
  }, [plan, request.documentId]);
  const cancel = useCallback(() => usePaletteSheetStore.getState().close(), []);
  const apply = useCallback(() => {
    if (!plan) return;
    const done = runSteps(useDocumentStore.getState().host, request.documentId, plan.label, plan.steps);
    if (!done.ok) {
      setFailure(done.error.message);
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
