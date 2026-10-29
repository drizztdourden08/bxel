/* @layer renderer-app @kind types */
import type { HealthState } from '../project-health/project-health.type';

interface HealthStore {
  state: HealthState;
  set: (state: HealthState) => void;
}

export type { HealthStore };
