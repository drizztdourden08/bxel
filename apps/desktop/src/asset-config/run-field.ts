/* @layer renderer-app @kind logic */
import type { CommandStep } from '@bxel/document';
import { useDocumentStore } from '../stores/useDocumentStore';
import { runSteps } from '../transactions/run-steps';
import type { AssetFocus, AssetOutcome } from './asset-config.type';

const runField = (focus: AssetFocus, label: string, steps: readonly CommandStep[]): AssetOutcome => {
  if (steps.length === 0) return null;
  const done = runSteps(useDocumentStore.getState().host, focus.documentId, label, steps);
  return done.ok ? null : done.error.message;
};

export { runField };
