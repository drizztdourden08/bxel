/* @layer renderer-app @kind logic */
import type { TitleBarButtonSpec } from '@drizztdourden08/brock-react';
import type { HistoryDirection } from './editor.type';
import { HISTORY_ITEMS } from './history.constants';
import { stepHistory } from './step-history';

const historyItem = (direction: HistoryDirection, available: boolean): TitleBarButtonSpec => {
  const item = HISTORY_ITEMS[direction];
  return {
    kind: 'button',
    label: available ? item.ready : item.empty,
    icon: item.icon,
    shortcut: item.shortcut,
    onSelect: () => stepHistory(direction),
  };
};

export { historyItem };
