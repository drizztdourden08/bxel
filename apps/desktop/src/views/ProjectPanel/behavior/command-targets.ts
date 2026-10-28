/* @layer renderer-app @kind logic */
import type { CommandContext } from '@drizztdourden08/brock-react';
import { commandArgs } from '../../../context-menu/command-args';
import type { ProjectArgs } from '../../../context-menu/menu-args.type';
import type { BrowserItem } from '../../../project-browser/project-browser.type';
import type { ProjectPanelModel } from '../ProjectPanel.type';
import { itemOfArgs } from './item-of-args';

const commandTargets = (model: ProjectPanelModel, context: CommandContext | undefined): readonly BrowserItem[] => {
  const item = itemOfArgs(model, commandArgs<ProjectArgs>(context));
  if (item === undefined) return model.selection.targets;
  return model.selection.keys.has(item.key) ? model.selection.targets : [item];
};

export { commandTargets };
