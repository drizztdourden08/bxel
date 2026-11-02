/* @layer renderer-app @kind types */
import type { FileFinding, HealthState, LinkFinding } from '../project-health/project-health.type';

interface HealthStore {
  state: HealthState;
  repaired: readonly LinkFinding[];
  rekeyed: readonly FileFinding[];
  set: (state: HealthState) => void;
  setRepaired: (repaired: readonly LinkFinding[]) => void;
  setRekeyed: (rekeyed: readonly FileFinding[]) => void;
}

export type { HealthStore };
