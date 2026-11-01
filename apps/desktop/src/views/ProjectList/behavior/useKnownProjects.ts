/* @layer renderer-app @kind hook */
import { useSettings } from '@drizztdourden08/brock-react';
import { useMemo } from 'react';
import { knownProjects } from '../../../project-manager/known-projects';
import type { KnownProject } from '../../../project-manager/project-manager.type';
import type { AppSettings } from '../../../settings.type';
import { useProjectStore } from '../../../stores/useProjectStore';

const useKnownProjects = (): readonly KnownProject[] => {
  const recents = useProjectStore((state) => state.recents);
  const held = useProjectStore((state) => state.held);
  const project = useProjectStore((state) => state.project);
  const { settings } = useSettings<AppSettings>();
  const pinned = settings.pinnedProjects;
  return useMemo(() => knownProjects(recents, held, project, pinned), [recents, held, project, pinned]);
};

export { useKnownProjects };
