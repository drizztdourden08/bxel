/* @layer renderer-app @kind hook */
import { dialogSpec } from '../../../editor/pending/dialog-spec';
import { usePendingStore } from '../../../stores/usePendingStore';
import { TRANSFORM_DIALOG_TEXT } from '../TransformDialog.constants';
import type { TransformDialogModel } from '../TransformDialog.type';

const useTransformDialog = (): TransformDialogModel | null => {
  const pending = usePendingStore((state) => state.pending);
  const outcome = usePendingStore((state) => state.outcome);
  const spec = dialogSpec(pending);
  if (!spec) return null;
  const error = outcome?.error ?? null;
  const note = error ?? (outcome ? TRANSFORM_DIALOG_TEXT.clipping(outcome.clipping) : null);
  return { spec, failed: error !== null, note };
};

export { useTransformDialog };
