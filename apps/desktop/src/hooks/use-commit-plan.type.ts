/* @layer renderer-app @kind types */
import type { StepPlan } from '../transactions/step-plan.type';

interface DonePlan extends StepPlan {
  done: string;
}

interface CommitPlanOptions {
  close: () => void;
  afterCommit?: () => void;
}

interface CommittedPlan {
  failure: string | null;
  apply: () => void;
}

export type { CommitPlanOptions, CommittedPlan, DonePlan };
