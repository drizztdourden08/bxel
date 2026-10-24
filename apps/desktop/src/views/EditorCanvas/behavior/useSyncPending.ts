/* @layer renderer-app @kind hook */
import { useEffect } from 'react';
import type { EditorTarget } from '../../../editor/editor.type';
import { usePendingStore } from '../../../stores/usePendingStore';

const useSyncPending = (target: EditorTarget | null): void => {
  useEffect(() => {
    const { pending, revise, clear } = usePendingStore.getState();
    if (!pending) return;
    if (target?.documentId === pending.documentId) revise(pending.spec);
    else clear();
  }, [target]);
};

export { useSyncPending };
