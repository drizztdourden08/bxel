/* @layer renderer-app @kind logic */
import type { MenuGroup } from '@drizztdourden08/tessera';
import type { ActionContext } from '../SpritesPanel.type';
import { combineGroup } from './combine-group';
import { editGroup } from './edit-group';
import { findGroup } from './find-group';
import { orderGroup } from './order-group';
import { selectGroup } from './select-group';
import { sheetGroup } from './sheet-group';
import { transformGroup } from './transform-group';

const actionGroups = (ctx: ActionContext): MenuGroup[] => [
  editGroup(ctx),
  combineGroup(ctx),
  orderGroup(ctx),
  sheetGroup(ctx),
  transformGroup(ctx),
  selectGroup(ctx),
  findGroup(ctx),
];

export { actionGroups };
