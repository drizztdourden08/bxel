/* @layer renderer-app @kind logic */
import type { TitleBarButtonSpec } from '@drizztdourden08/brock-react';
import type { HistoryDirection } from './editor.type';
import { HISTORY_ITEMS } from './history.constants';

const historyItem = (direction: HistoryDirection, available: boolean): TitleBarButtonSpec => {
  const item = HISTORY_ITEMS[direction];
  return {
    kind: 'button',
    label: available ? item.ready : item.empty,
    icon: item.icon,
    command: item.command,
    disabled: !available,
  };
};

export { historyItem };
