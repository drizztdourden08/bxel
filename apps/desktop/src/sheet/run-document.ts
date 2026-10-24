/* @layer renderer-app @kind logic */
import type { CommandStep, TransactionOk } from '@bxel/document';
import { useDocumentStore } from '../stores/useDocumentStore';
import { useNoticeStore } from '../stores/useNoticeStore';
import { runSteps } from '../transactions/run-steps';

const runDocument = (label: string, steps: readonly CommandStep[]): TransactionOk | null => {
  const { host, activeId } = useDocumentStore.getState();
  if (activeId === null) return null;
  const result = runSteps(host, activeId, label, steps);
  if (result.ok) return result;
  useNoticeStore.getState().post(result.error.message);
  return null;
};

export { runDocument };
