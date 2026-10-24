/* @layer renderer-app @kind hook */
import { findBank } from '@bxel/document';
import { toast } from '@drizztdourden08/brock-react';
import { useCallback, useMemo, useState } from 'react';
import { CHANGE_TEXT } from '../../../palette-change/palette-change.constants';
import type { ChangeRequest } from '../../../palette-change/palette-change.type';
import { changePreview } from '../../../palette-change/change-preview';
import { runChange } from '../../../palette-change/run-change';
import { useChangeStore } from '../../../stores/useChangeStore';
import { useDocumentStore } from '../../../stores/useDocumentStore';
import type { ChangeDialogState } from '../PaletteChangeDialog.type';

const useChangeDialog = (request: ChangeRequest): ChangeDialogState => {
  const view = useDocumentStore((state) => state.views[request.documentId] ?? null);
  const [failure, setFailure] = useState<string | null>(null);
  const bank = useMemo(() => (view ? (findBank(view.state.artwork, request.bankId) ?? null) : null), [view, request.bankId]);
  const preview = useMemo(() => (view ? changePreview(view, request) : null), [view, request]);
  const error = useMemo(() => {
    if (!preview) return CHANGE_TEXT.noFile;
    if (preview.error !== null) return preview.error;
    const check = runChange(useDocumentStore.getState().host, request, 'preview');
    return check.ok ? null : check.message;
  }, [preview, request]);

  const apply = useCallback((): void => {
    const outcome = runChange(useDocumentStore.getState().host, request, 'commit');
    if (!outcome.ok) {
      setFailure(CHANGE_TEXT.failed(outcome.message));
      return;
    }
    toast(CHANGE_TEXT.done[request.kind], { variant: 'success' });
    useChangeStore.getState().hide();
  }, [request]);

  const cancel = useCallback((): void => useChangeStore.getState().hide(), []);

  return { bank, preview, error, failure, apply, cancel };
};

export { useChangeDialog };
