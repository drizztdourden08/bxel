/* @layer renderer-app @kind logic */
import type { ContextMenuContext, ContextMenuEntry } from '@drizztdourden08/brock-react';
import { EMPTY_STATUS, NEW_MENU_KEY } from '../../../panel-browser/project-browser.constants';
import { isExpandable } from '../../../panel-browser/is-expandable';
import type { ProjectPanelModel } from '../ProjectPanel.type';
import { assetEntries } from './asset-entries';
import { backgroundEntries } from './background-entries';
import { folderEntries } from './folder-entries';
import { ghostEntries } from './ghost-entries';
import { manyEntries } from './many-entries';
import { menuKeyOf } from './menu-key-of';
import { newKindEntries } from './new-kind-entries';

const projectMenuEntries = (context: ContextMenuContext, model: ProjectPanelModel): readonly ContextMenuEntry[] => {
  const key = menuKeyOf(context);
  if (key === NEW_MENU_KEY) return newKindEntries();
  const item = key === undefined ? undefined : model.browser.itemOf(key);
  if (item === undefined || item.role === 'group') return backgroundEntries(model.rowActions.newHere);
  const status = model.data.statuses.get(item.key) ?? EMPTY_STATUS;
  const targets = model.selection.keys.has(item.key) ? model.selection.targets : [item];
  if (targets.length > 1) return manyEntries(targets);
  if (item.role === 'ghost') return ghostEntries(item, status);
  return isExpandable(item) ? folderEntries(item) : assetEntries(item, status);
};

export { projectMenuEntries };
