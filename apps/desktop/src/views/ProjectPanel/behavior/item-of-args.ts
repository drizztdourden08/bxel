/* @layer renderer-app @kind logic */
import type { ProjectArgs } from '../../../context-menu/menu-args.type';
import type { BrowserItem } from '../../../project-browser/project-browser.type';
import type { ProjectPanelModel } from '../ProjectPanel.type';

const itemOfArgs = (model: ProjectPanelModel, args: Partial<ProjectArgs>): BrowserItem | undefined => {
  if (args.key !== undefined) return model.browser.itemOf(args.key);
  if (args.path !== undefined) return model.browser.itemOf(args.path);
  if (args.assetId === undefined) return undefined;
  return [...model.data.tree.items.values()].find((each) => each.row?.assetId === args.assetId);
};

export { itemOfArgs };
