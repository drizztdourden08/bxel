/* @layer renderer-app @kind hook */
import { getPlatform, toast, useSettings } from '@drizztdourden08/brock-react';
import { useCallback, useMemo, useState } from 'react';
import type { AppSettings } from '../../../settings.type';
import { closeProject } from '../../../project/close-project';
import { openProject } from '../../../project/open-project';
import { removeRecentProject } from '../../../project/remove-recent-project';
import { newProjectFromHub } from '../../../project-manager/new-project-from-hub';
import { openKnownProject } from '../../../project-manager/open-known-project';
import type { ProjectListActions, ProjectListModel } from '../ProjectList.type';
import { PROJECTS_TEXT } from '../ProjectList.constants';
import { useDiskProject } from './useDiskProject';
import { useKnownProjects } from './useKnownProjects';

const useProjectList = (): ProjectListModel => {
  const known = useKnownProjects();
  const { settings, patch } = useSettings<AppSettings>();
  const pinned = settings.pinnedProjects;
  const [chosen, setChosen] = useState<string | null>(null);
  const selected = known.find((project) => project.key === chosen) ?? known.find((project) => project.open) ?? known[0] ?? null;
  const disk = useDiskProject(selected);
  const select = useCallback((key: string) => setChosen(key), []);
  const actions = useMemo<ProjectListActions>(
    () => ({
      newProject: newProjectFromHub,
      browseProject: () => void openProject(),
      openProject: (project) => void openKnownProject(project.rootRealPath),
      closeProject: () => void closeProject(),
      removeFromList: (project) => {
        void removeRecentProject({ projectId: project.projectId, name: project.name, rootRealPath: project.rootRealPath, openedAt: project.openedAt });
        toast(PROJECTS_TEXT.removedFromList(project.name), { variant: 'info' });
      },
      togglePin: (project) => patch({ pinnedProjects: project.pinned ? pinned.filter((key) => key !== project.key) : [...pinned, project.key] }),
      reveal: (project) => void getPlatform().documents?.reveal(project.rootRealPath),
    }),
    [patch, pinned],
  );
  return { known, selected, select, disk, actions };
};

export { useProjectList };
