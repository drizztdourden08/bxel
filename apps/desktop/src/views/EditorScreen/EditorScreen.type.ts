/* @layer renderer-app @kind types */
import type { LinkFinding } from '../../project-health/project-health.type';
import type { StageFault } from '../../stage-state/stage-state.type';

interface StageBodyProps {
  adding: boolean;
}

interface StageLoadingProps {
  progress: number | null;
  done: number;
  total: number;
}

interface StageMissingProps {
  links: readonly LinkFinding[];
}

interface StageFaultProps {
  fault: StageFault;
}

export type { StageBodyProps, StageFaultProps, StageLoadingProps, StageMissingProps };
