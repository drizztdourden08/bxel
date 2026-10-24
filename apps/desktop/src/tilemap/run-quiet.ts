/* @layer renderer-app @kind logic */
import type { CommandStep, TransactionResult } from '@bxel/document';
import { useDocumentStore } from '../stores/useDocumentStore';
import { runSteps } from '../transactions/run-steps';

const runQuiet = (label: string, steps: readonly CommandStep[]): TransactionResult | null => {
  const { host, activeId } = useDocumentStore.getState();
  return activeId === null ? null : runSteps(host, activeId, label, steps);
};

export { runQuiet };
