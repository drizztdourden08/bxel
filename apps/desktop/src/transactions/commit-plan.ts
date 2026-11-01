/* @layer renderer-app @kind logic */
import type { DocumentId } from '@bxel/document';
import { useDocumentStore } from '../stores/useDocumentStore';
import { runSteps } from './run-steps';
import type { StepPlan } from './step-plan.type';

const commitPlan = (documentId: DocumentId, plan: StepPlan): string | null => {
  const done = runSteps(useDocumentStore.getState().host, documentId, plan.label, plan.steps);
  return done.ok ? null : done.error.message;
};

export { commitPlan };
