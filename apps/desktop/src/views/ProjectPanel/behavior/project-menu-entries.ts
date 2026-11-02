/* @layer renderer-app @kind logic */
import type { ContextMenuContext, ContextMenuEntry } from '@drizztdourden08/brock-react';
import { EMPTY_STATUS, NEW_MENU_KEY } from '../../../panel-browser/project-browser.constants';
import { isExpandable } from '../../../panel-browser/is-expandable';
import type { ProjectPanelModel } from '../ProjectPanel.type';
import { assetEntries } from './asset-entries';
import { backgroundEntries } from './background-entries';
import { menuTargets } from './command-targets';
import { folderEntries } from './folder-entries';
import { ghostEntries } from './ghost-entries';
import { manyEntries } from './many-entries';
import { menuKeyOf } from './menu-key-of';
import { fromSelectionEntries, newKindEntries } from './new-kind-entries';
import { spriteIdsOf } from './sprite-ids-of';

const projectMenuEntries = (context: ContextMenuContext, model: ProjectPanelModel): readonly ContextMenuEntry[] => {
  const key = menuKeyOf(context);
  if (key === NEW_MENU_KEY) return [...newKindEntries(undefined, true), ...fromSelectionEntries(spriteIdsOf(model.selection.targets).length)];
  const item = key === undefined ? undefined : model.browser.itemOf(key);
  if (item === undefined || item.role === 'group') return backgroundEntries(model.rowActions.newHere);
  const status = model.data.statuses.get(item.key) ?? EMPTY_STATUS;
  const chosen = menuTargets(model, context.selection);
  const targets = chosen.length > 0 ? chosen : [item];
  if (targets.length > 1) return manyEntries(targets);
  if (item.role === 'ghost') return ghostEntries(item, status);
  if (isExpandable(item)) return folderEntries(item);
  const uses = item.row === null ? 0 : (model.source.facts.get(item.row.id)?.uses.length ?? 0);
  return assetEntries(item, status, uses);
};

export { projectMenuEntries };
