/* @layer renderer-app @kind logic */
import { useDocumentStore } from '../stores/useDocumentStore';
import { runSteps } from '../transactions/run-steps';
import type { PanelOutcome, PanelRun } from './palette-panel.type';

const runPanelSteps = ({ target, label, steps, done }: PanelRun): PanelOutcome => {
  const result = runSteps(useDocumentStore.getState().host, target.documentId, label, steps);
  return result.ok ? { ok: true, message: done } : { ok: false, message: result.error.message };
};

export { runPanelSteps };
