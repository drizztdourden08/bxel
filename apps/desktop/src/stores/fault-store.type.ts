/* @layer renderer-app @kind types */
import type { StageFault } from '../stage-state/stage-state.type';

interface FaultStore {
  fault: StageFault | null;
  set: (fault: StageFault | null) => void;
}

export type { FaultStore };
