/* @layer renderer-app @kind hook */
import { useCallback, useState } from 'react';
import { openProjectSettings } from '../../../config-entry/open-project-settings';
import { closeProject } from '../../../project/close-project';
import { folderDir } from '../../../project/folder-dir';
import { grantProjectFolder } from '../../../project/grant-project-folder';
import { openProject } from '../../../project/open-project';
import { removeRecentProject } from '../../../project/remove-recent-project';
import { useProjectStore } from '../../../stores/useProjectStore';
import { projectDirs } from '../../../workspace/project-dirs';
import { startNewAsset } from '../../../project/start-new-asset';
import type { PanelView, ProjectPanelModel } from '../ProjectPanel.type';
import { useAssetsView } from '../sub-components/AssetsView/behavior/useAssetsView';
import { useEntryActions } from './useEntryActions';
import { useProjectActions } from './useProjectActions';
import { useProjectListing } from './useProjectListing';
import { useProjectLocation } from './useProjectLocation';

const useProjectPanel = (): ProjectPanelModel => {
  const project = useProjectStore((state) => state.project);
  const recents = useProjectStore((state) => state.recents);
  const [selected, select] = useState<string | null>(null);
  const [view, setView] = useState<PanelView>('assets');
  const [search, setSearch] = useState('');
  const location = useProjectLocation(project);
  const { folder, segments } = location;
  const dir = folder?.granted ? folderDir(folder.path, segments) : null;
  const { listing, error, refresh } = useProjectListing(dir);
  const spriteDir = view === 'assets' && project ? (projectDirs(project).sprite ?? dir) : dir;
  const actions = useProjectActions({ dir: spriteDir, enter: location.enter, refresh });
  const entries = useEntryActions({ dir, refresh });
  const assets = useAssetsView(project, search);

  const grantFolder = useCallback(() => {
    if (folder) void grantProjectFolder(folder);
  }, [folder]);

  return {
    ...actions,
    ...entries,
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
    view,
    setView,
    search,
    setSearch,
    assets,
    newAsset: (kind) => (kind === 'sprite' ? actions.startNaming() : startNewAsset(kind)),
    chooseFolder: location.chooseFolder,
    up: location.up,
    newProject: () => useProjectStore.getState().showDialog(true),
    openProject: () => void openProject(),
    openRecent: (root) => void openProject(root),
    removeRecent: (entry) => void removeRecentProject(entry),
    openSettings: () => openProjectSettings(),
    closeProject: () => void closeProject(),
  };
};

export { useProjectPanel };
