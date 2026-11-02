/* @layer renderer-app @kind logic */
import type { CommandContext } from '@drizztdourden08/brock-react';
import { holdFiles } from '../../../file-ops/hold-files';
import type { ProjectPanelModel } from '../ProjectPanel.type';
import { commandTargets } from './command-targets';
import { itemPaths } from './item-paths';

const cutTargets = (model: ProjectPanelModel, context?: CommandContext): void => holdFiles(itemPaths(commandTargets(model, context)), true);

export { cutTargets };
