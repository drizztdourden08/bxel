/* @layer renderer-app @kind logic */
import type { ListedEntry } from '@bxel/project';
import { joinInside } from '@bxel/project';
import { folderDir } from '../../../project/folder-dir';
import type { ProjectPanelModel } from '../ProjectPanel.type';

const entryPath = (model: ProjectPanelModel, entry: ListedEntry): string => {
  const dir = model.folder ? folderDir(model.folder.path, model.segments) : null;
  const joined = dir === null ? null : joinInside(dir, entry.name);
  return joined?.ok ? joined.value : '';
};

export { entryPath };
