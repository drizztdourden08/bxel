/* @layer renderer-app @kind hook */
import { useMemo } from 'react';
import { pendingLabel } from '../../../editor/pending/pending-label';
import { scopeText } from '../../../editor/pending/scope-text';
import { useEditorTarget } from '../../../hooks/useEditorTarget';
import { usePendingStore } from '../../../stores/usePendingStore';
import type { ApplyBarModel } from '../ApplyBar.type';

const useApplyBar = (): ApplyBarModel | null => {
  const target = useEditorTarget();
  const pending = usePendingStore((state) => state.pending);
  const outcome = usePendingStore((state) => state.outcome);
  return useMemo(() => {
    if (!target || !pending || pending.editing || !outcome) return null;
    return { title: pendingLabel(pending.spec), scope: scopeText(target, pending), clipping: outcome.clipping, error: outcome.error };
  }, [target, pending, outcome]);
};

export { useApplyBar };
