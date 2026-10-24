/* @layer renderer-app @kind hook */
import { useCallback, useState } from 'react';
import { closeProject } from '../../../project/close-project';
import { folderDir } from '../../../project/folder-dir';
import { grantProjectFolder } from '../../../project/grant-project-folder';
import { openProject } from '../../../project/open-project';
import { useProjectStore } from '../../../stores/useProjectStore';
import type { ProjectPanelModel } from '../ProjectPanel.type';
import { useProjectActions } from './useProjectActions';
import { useProjectListing } from './useProjectListing';
import { useProjectLocation } from './useProjectLocation';

const useProjectPanel = (): ProjectPanelModel => {
  const project = useProjectStore((state) => state.project);
  const recents = useProjectStore((state) => state.recents);
  const [selected, select] = useState<string | null>(null);
  const location = useProjectLocation(project);
  const { folder, segments } = location;
  const dir = folder?.granted ? folderDir(folder.path, segments) : null;
  const { listing, error, refresh } = useProjectListing(dir);
  const actions = useProjectActions({ dir, enter: location.enter, refresh });

  const grantFolder = useCallback(() => {
    if (folder) void grantProjectFolder(folder);
  }, [folder]);

  return {
    project,
    recents,
    folder,
    segments,
    listing,
    error,
    selected,
    select,
    refresh,
    grantFolder,
    chooseFolder: location.chooseFolder,
    up: location.up,
    openEntry: actions.openEntry,
    naming: actions.naming,
    nameError: actions.nameError,
    startNaming: actions.startNaming,
    stopNaming: actions.stopNaming,
    createFile: actions.createFile,
    newProject: () => useProjectStore.getState().showDialog(true),
    openProject: () => void openProject(),
    openRecent: (root) => void openProject(root),
    closeProject,
  };
};

export { useProjectPanel };
