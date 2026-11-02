/* @layer renderer-app @kind logic */
import type { CommandContext } from '@drizztdourden08/brock-react';
import { holdFiles } from '../../../file-ops/hold-files';
import { pasteFiles } from '../../../file-ops/paste-files';
import type { ProjectPanelModel } from '../ProjectPanel.type';
import { commandTargets } from './command-targets';
import { itemPaths } from './item-paths';
import { pasteFolderOf } from './paste-folder-of';

const cutTargets = (model: ProjectPanelModel, context?: CommandContext): void => holdFiles(itemPaths(commandTargets(model, context)), true);

const copyTargets = (model: ProjectPanelModel, context?: CommandContext): void => holdFiles(itemPaths(commandTargets(model, context)), false);

const pasteTargets = (model: ProjectPanelModel, context?: CommandContext): void => {
  const folder = pasteFolderOf(commandTargets(model, context), model.data.tree);
  if (folder !== undefined) void pasteFiles(folder.path);
};

export { copyTargets, cutTargets, pasteTargets };
