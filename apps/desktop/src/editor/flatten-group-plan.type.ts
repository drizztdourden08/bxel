/* @layer renderer-app @kind types */
interface PlanItem {
  readonly id: string;
  readonly kind?: string;
  readonly parentId?: string;
  readonly visible: boolean;
}

interface FlattenStep {
  op: 'merge' | 'ungroup';
  id: string;
}

interface FlattenPlan {
  steps: readonly FlattenStep[];
  keep: string | null;
}

export type { FlattenPlan, FlattenStep, PlanItem };
