/* @layer renderer-app @kind logic */
import type { CommandStep } from '@bxel/document';
import { useDocumentStore } from '../stores/useDocumentStore';
import { runSteps } from '../transactions/run-steps';
import { presetLive } from './preset-live';

const editDocumentPreset = (label: string, step: CommandStep): string | null => {
  const live = presetLive();
  if (!live) return null;
  const done = runSteps(useDocumentStore.getState().host, live.documentId, label, [step]);
  return done.ok ? null : done.error.message;
};

export { editDocumentPreset };
