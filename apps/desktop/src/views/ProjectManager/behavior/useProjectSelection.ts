/* @layer renderer-app @kind hook */
import { useState } from 'react';
import type { KnownProject } from '../../../project-manager/project-manager.type';
import type { ProjectSelection } from '../ProjectManager.type';

const useProjectSelection = (known: readonly KnownProject[]): ProjectSelection => {
  const [key, select] = useState<string | null>(null);
  const picked = known.find((each) => each.key === key);
  return { selected: picked ?? known.find((each) => each.open) ?? known[0] ?? null, select };
};

export { useProjectSelection };
