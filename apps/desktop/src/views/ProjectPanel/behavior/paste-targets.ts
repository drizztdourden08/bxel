/* @layer renderer-app @kind logic */
import type { CommandContext } from '@drizztdourden08/brock-react';
import { pasteFiles } from '../../../file-ops/paste-files';
import type { ProjectPanelModel } from '../ProjectPanel.type';
import { commandTargets } from './command-targets';
import { pasteFolderOf } from './paste-folder-of';

const pasteTargets = (model: ProjectPanelModel, context?: CommandContext): void => {
  const folder = pasteFolderOf(commandTargets(model, context), model.data.tree);
  if (folder !== undefined) void pasteFiles(folder.path);
};

export { pasteTargets };
