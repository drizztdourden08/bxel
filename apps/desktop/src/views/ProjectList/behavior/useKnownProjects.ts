/* @layer renderer-app @kind hook */
import { useMemo } from 'react';
import { knownProjects } from '../../../project-manager/known-projects';
import type { KnownProject } from '../../../project-manager/project-manager.type';
import { useProjectStore } from '../../../stores/useProjectStore';

const useKnownProjects = (): readonly KnownProject[] => {
  const recents = useProjectStore((state) => state.recents);
  const held = useProjectStore((state) => state.held);
  const project = useProjectStore((state) => state.project);
  return useMemo(() => knownProjects(recents, held, project), [recents, held, project]);
};

export { useKnownProjects };
