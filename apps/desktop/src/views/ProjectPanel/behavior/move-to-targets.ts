/* @layer renderer-app @kind logic */
import type { BrowserItem } from '../../../panel-browser/project-browser.type';
import { allFolders } from '../../../project-browser/all-folders';
import { moveTargets } from '../../../project-browser/move-targets';
import { useMoveToStore } from '../../../stores/useMoveToStore';
import type { ProjectPanelModel } from '../ProjectPanel.type';
import { itemPaths } from './item-paths';

const moveToTargets = (model: ProjectPanelModel, items: readonly BrowserItem[]): void => {
  const paths = itemPaths(items);
  if (paths.length === 0) return;
  const { roots, folders, rows } = model.source;
  useMoveToStore.getState().show({ paths, targets: moveTargets(roots, allFolders(folders, rows), paths) });
};

export { moveToTargets };
