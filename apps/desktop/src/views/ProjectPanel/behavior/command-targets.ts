/* @layer renderer-app @kind logic */
import type { CommandContext } from '@drizztdourden08/brock-react';
import { commandArgs } from '../../../context-menu/command-args';
import type { ProjectArgs } from '../../../context-menu/menu-args.type';
import type { BrowserItem } from '../../../panel-browser/project-browser.type';
import { ITEM_SELECTOR } from '../ProjectPanel.constants';
import type { ProjectPanelModel } from '../ProjectPanel.type';
import { itemOfArgs } from './item-of-args';
import { menuTargets } from './menu-targets';

const focusedItem = (model: ProjectPanelModel): BrowserItem | undefined => {
  const key = document.activeElement?.closest<HTMLElement>(ITEM_SELECTOR)?.dataset.treeKey;
  return key === undefined ? undefined : model.browser.itemOf(key);
};

const commandTargets = (model: ProjectPanelModel, context: CommandContext | undefined): readonly BrowserItem[] => {
  const chosen = menuTargets(model, context?.selection);
  if (chosen.length > 0) return chosen;
  const item = itemOfArgs(model, commandArgs<ProjectArgs>(context)) ?? (model.selection.targets.length === 0 ? focusedItem(model) : undefined);
  if (item === undefined) return model.selection.targets;
  return model.selection.keys.has(item.key) ? model.selection.targets : [item];
};

export { commandTargets };
