/* @layer renderer-app @kind hook */
import { useMemo } from 'react';
import { openProjectSettings } from '../../../config-entry/open-project-settings';
import { closeProject } from '../../../project/close-project';
import { openProject } from '../../../project/open-project';
import { openKnownProject } from '../../../project-manager/open-known-project';
import { removeRecentProject } from '../../../project/remove-recent-project';
import { newAssetFromHub } from '../../../project-manager/new-asset-from-hub';
import { newProjectFromHub } from '../../../project-manager/new-project-from-hub';
import { openInAssetSettings } from '../../../project-manager/open-in-asset-settings';
import { openToEdit } from '../../../project-manager/open-to-edit';
import { renameOpenProject } from '../../../project-manager/rename-open-project';
import type { ManagerActions } from '../ProjectManager.type';

const useManagerActions = (): ManagerActions =>
  useMemo(
    () => ({
      newProject: newProjectFromHub,
      browseProject: () => void openProject(),
      openProject: (project) => void openKnownProject(project.rootRealPath),
      closeProject: () => void closeProject(),
      removeFromList: (project) => void removeRecentProject({ projectId: project.projectId, name: project.name, rootRealPath: project.rootRealPath, openedAt: project.openedAt }),
      openConfig: openProjectSettings,
      newAsset: newAssetFromHub,
      inAssetSettings: openInAssetSettings,
      toEdit: openToEdit,
      renameProject: renameOpenProject,
    }),
    [],
  );

export { useManagerActions };
