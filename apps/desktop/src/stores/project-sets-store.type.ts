/* @layer renderer-app @kind types */
import type { ProjectResult, SwatchSet, SwatchSetId } from '@bxel/project';

interface ProjectSetsState {
  projectName: string | null;
  sets: readonly SwatchSet[];
  open: (name: string, sets: readonly SwatchSet[]) => void;
  close: () => void;
  put: (set: SwatchSet) => ProjectResult<readonly SwatchSet[]> | null;
  drop: (setId: SwatchSetId) => void;
}

export type { ProjectSetsState };
