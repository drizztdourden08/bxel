/* @layer renderer-app @kind hook */
import { splitIntoAssets } from '@bxel/document';
import { useCallback, useMemo, useState } from 'react';
import { useDocumentStore } from '../../../stores/useDocumentStore';
import { useProjectStore } from '../../../stores/useProjectStore';
import { useWorkspaceStore } from '../../../stores/useWorkspaceStore';
import { runSplit } from '../../../workspace/run-split';
import type { SplitDestination } from '../../../workspace/workspace.type';
import type { SplitDialogModel } from '../SplitDialog.type';

const useSplitDialog = (): SplitDialogModel => {
  const documentId = useWorkspaceStore((state) => state.splitting);
  const showSplit = useWorkspaceStore((state) => state.showSplit);
  const view = useDocumentStore((state) => (documentId === null ? undefined : state.views[documentId]));
  const hasProject = useProjectStore((state) => state.project !== null);
  const [destination, setDestination] = useState<SplitDestination>('beside');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const plan = useMemo(() => (view ? splitIntoAssets(view.state.artwork) : null), [view]);
  const close = useCallback(() => {
    setError(null);
    showSplit(null);
  }, [showSplit]);
  const run = useCallback(() => {
    if (documentId === null) return;
    setBusy(true);
    void runSplit(documentId, hasProject ? destination : 'beside').then((outcome) => {
      setBusy(false);
      if (outcome.kind === 'failed') setError(outcome.message);
      else if (outcome.kind === 'done') close();
    });
  }, [close, destination, documentId, hasProject]);
  return { plan, destination, setDestination, hasProject, busy, error, run, close };
};

export { useSplitDialog };
