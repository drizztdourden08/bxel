/* @layer renderer-app @kind logic */
import type { MenuItem } from '@drizztdourden08/brock-react';
import type { BxelContext } from '../ui-context/bxel-context.type';
import { evaluate } from '../ui-context/evaluate';
import { menuItem } from './menu-item';

const ruledItem = (context: BxelContext, id: string, label: string, extra: Partial<MenuItem> = {}): MenuItem | null => {
  const ui = evaluate(id, context);
  if (ui.state === 'hidden') return null;
  if (ui.state === 'disabled') return menuItem(id, label, { ...extra, disabled: true, ...(ui.reason === null ? {} : { description: ui.reason }) });
  return menuItem(id, label, extra);
};

export { ruledItem };
