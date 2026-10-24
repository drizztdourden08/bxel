/* @layer renderer-app @kind logic */
import type { MenuGroup } from '@drizztdourden08/tessera';
import type { ActionContext } from '../SpritesPanel.type';
import { editGroup } from './edit-group';
import { orderGroup } from './order-group';
import { selectGroup } from './select-group';
import { sheetGroup } from './sheet-group';
import { transformGroup } from './transform-group';

const actionGroups = (ctx: ActionContext): MenuGroup[] => [
  editGroup(ctx),
  orderGroup(ctx),
  sheetGroup(ctx),
  transformGroup(ctx),
  selectGroup(ctx),
];

export { actionGroups };
