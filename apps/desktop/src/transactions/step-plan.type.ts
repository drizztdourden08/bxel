/* @layer renderer-app @kind types */
import type { CommandStep } from '@bxel/document';

interface StepPlan {
  label: string;
  steps: readonly CommandStep[];
}

export type { StepPlan };
