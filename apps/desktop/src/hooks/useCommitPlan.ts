/* @layer renderer-app @kind hook */
import type { DocumentId } from '@bxel/document';
import { toast } from '@drizztdourden08/brock-react';
import { useCallback, useState } from 'react';
import { commitPlan } from '../transactions/commit-plan';
import type { CommitPlanOptions, CommittedPlan, DonePlan } from './use-commit-plan.type';

const useCommitPlan = (documentId: DocumentId, plan: DonePlan | null, options: CommitPlanOptions): CommittedPlan => {
  const { close, afterCommit } = options;
  const [failure, setFailure] = useState<string | null>(null);
  const apply = useCallback(() => {
    if (!plan) return;
    const message = commitPlan(documentId, plan);
    if (message !== null) {
      setFailure(message);
      return;
    }
    afterCommit?.();
    toast(plan.done, { variant: 'success' });
    close();
  }, [plan, documentId, afterCommit, close]);
  return { failure, apply };
};

export { useCommitPlan };
