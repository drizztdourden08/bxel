/* @layer renderer-app @kind types */
import type { HealthState, LinkFinding } from '../project-health/project-health.type';

interface HealthStore {
  state: HealthState;
  repaired: readonly LinkFinding[];
  set: (state: HealthState) => void;
  setRepaired: (repaired: readonly LinkFinding[]) => void;
}

export type { HealthStore };
