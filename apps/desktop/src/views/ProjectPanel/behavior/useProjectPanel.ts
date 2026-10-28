/* @layer renderer-app @kind hook */
import { useCallback, useMemo, useState } from 'react';
import { openDemoProject } from '../../../demo/open-demo-project';
import { openProjectSettings } from '../../../config-entry/open-project-settings';
import { filterCounts } from '../../../panel-browser/filter-counts';
import { packCurrentProject } from '../../../project/pack-current-project';
import { NARROW_WIDTH } from '../../../panel-browser/project-browser.constants';
import { useBrowserEdit } from '../../../panel-browser/useBrowserEdit';
import { useBrowserModel } from '../../../panel-browser/useBrowserModel';
import { useBrowserQuery } from '../../../panel-browser/useBrowserQuery';
import { useBrowserRows } from '../../../panel-browser/useBrowserRows';
import { useBrowserSelection } from '../../../panel-browser/useBrowserSelection';
import { useBrowserSource } from '../../../panel-browser/useBrowserSource';
import { useBrowserView } from '../../../panel-browser/useBrowserView';
import { useEditState } from '../../../panel-browser/useEditState';
import { closeProject } from '../../../project/close-project';
import { grantProjectFolder } from '../../../project/grant-project-folder';
import { openProject } from '../../../project/open-project';
import { removeLinkedFolder } from '../../../project/remove-linked-folder';
import { removeRecentProject } from '../../../project/remove-recent-project';
import { useProjectStore } from '../../../stores/useProjectStore';
import type { ProjectPanelModel } from '../ProjectPanel.type';
import { normalRoot } from './normal-root';
import { roleKindsOf } from './role-kinds-of';
import { useRowBulk } from './useRowBulk';
import { useRowCreate } from './useRowCreate';
import { useRowDrag } from './useRowDrag';
import { useRowPick } from './useRowPick';
import { useTreeKeys } from './useTreeKeys';

const useProjectPanel = (): ProjectPanelModel => {
  const project = useProjectStore((state) => state.project);
  const recents = useProjectStore((state) => state.recents);
  const source = useBrowserSource(project);
  const data = useBrowserModel(source);
  const view = useBrowserView(project?.manifest.projectId ?? null);
  const query = useBrowserQuery();
  const state = useEditState();
  const create = state.editing?.kind === 'create' ? { parentKey: state.editing.parentKey, create: state.editing.create } : null;
  const browser = useBrowserRows({ model: data, view, query: query.query, create });
  const selection = useBrowserSelection(browser);
  const edit = useBrowserEdit({ state, itemOf: browser.itemOf, selection, view, refresh: source.refresh });
  const parts = { project, source, data, view, query, browser, selection, edit };
  const pick = useRowPick(parts);
  const keyDown = useTreeKeys(parts, pick);
  const rowActions = { ...pick, ...useRowCreate(parts), ...useRowBulk(parts), keyDown };
  const drag = useRowDrag(parts);
  const [narrow, setNarrow] = useState(false);
  const setWidth = useCallback((width: number) => setNarrow(width < NARROW_WIDTH), []);
  const roleKinds = useMemo(() => roleKindsOf(project), [project]);
  const counts = useMemo(() => filterCounts(data.tree, data.statuses), [data.tree, data.statuses]);

  const findFolder = useCallback(
    (rootKey: string) => project?.folders.find((each) => normalRoot(each.path) === normalRoot(rootKey)),
    [project],
  );

  return {
    ...parts,
    recents,
    density: narrow ? 'compact' : view.density,
    roleKinds,
    counts,
    rowActions,
    drag,
    setWidth,
    refresh: source.refresh,
    newProject: () => useProjectStore.getState().showDialog(true),
    openProject: () => void openProject(),
    openRecent: (root) => void openProject(root),
    removeRecent: (entry) => void removeRecentProject(entry),
    openDemo: () => void openDemoProject(),
    closeProject: () => void closeProject(),
    openSettings: () => openProjectSettings('general'),
    openHub: () => openProjectSettings('manager'),
    pack: () => void packCurrentProject(),
    grantFolder: (rootKey) => {
      const folder = findFolder(rootKey);
      if (folder) void grantProjectFolder(folder);
    },
    unlink: (rootKey) => {
      const folder = findFolder(rootKey);
      if (folder) void removeLinkedFolder(folder.folderId);
    },
  };
};

export { useProjectPanel };
