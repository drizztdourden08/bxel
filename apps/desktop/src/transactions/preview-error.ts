/* @layer renderer-app @kind logic */
import type { DocumentId } from '@bxel/document';
import { useDocumentStore } from '../stores/useDocumentStore';
import { stepRequest } from './step-request';
import type { StepPlan } from './step-plan.type';

const previewError = (documentId: DocumentId, plan: StepPlan | null): string | null => {
  if (!plan || plan.steps.length === 0) return null;
  const { host } = useDocumentStore.getState();
  const check = host.execute({ ...stepRequest(host, documentId, plan.label, plan.steps), mode: 'preview' });
  return check.ok ? null : check.error.message;
};

export { previewError };
