/* @layer renderer-app @kind logic */
import type { ContextMenuEntry } from '@drizztdourden08/brock-react';
import { unless } from '../../../context-menu/unless';
import { SHEET_COMMAND as ID } from '../../../keymap/sheet-command-id.constants';
import type { CurrentManager } from '../../../sheet-manager/manager.type';
import { MANAGER_TEXT } from '../../../sheet-manager/manager-text.constants';

const orderEntries = ({ ids, facts, shown, sortKey }: Pick<CurrentManager, 'ids' | 'facts' | 'shown' | 'sortKey'>): ContextMenuEntry => {
  const pick = unless(ids.length > 0, MANAGER_TEXT.none);
  const orderable = sortKey !== 'manual' && shown.length === facts.length;
  return {
    label: MANAGER_TEXT.groups.order,
    items: [
      { command: ID.moveEarlier, label: MANAGER_TEXT.earlier, ...pick },
      { command: ID.moveLater, label: MANAGER_TEXT.later, ...pick },
      { command: 'sprite.move_to_start', label: MANAGER_TEXT.toTop, ...pick },
      { command: 'sprite.move_to_end', label: MANAGER_TEXT.toEnd, ...pick },
      { command: 'sprite.sort_by_name', label: MANAGER_TEXT.sortByName },
      { command: 'sprite.use_view_order', label: MANAGER_TEXT.useOrder, hidden: !orderable },
    ],
  };
};

export { orderEntries };
