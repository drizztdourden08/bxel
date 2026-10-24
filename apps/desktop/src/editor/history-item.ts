/* @layer renderer-app @kind logic */
import type { TitleBarButtonSpec } from '@drizztdourden08/brock-react';
import type { HistoryDirection } from './editor.type';
import { HISTORY_ITEMS } from './history.constants';

const readyLabel = (direction: HistoryDirection, name: string | undefined): string =>
  name === undefined ? HISTORY_ITEMS[direction].ready : HISTORY_ITEMS[direction].named(name);

const historyItem = (direction: HistoryDirection, available: boolean, name?: string): TitleBarButtonSpec => {
  const item = HISTORY_ITEMS[direction];
  return {
    kind: 'button',
    label: available ? readyLabel(direction, name) : item.empty,
    icon: item.icon,
    command: item.command,
    disabled: !available,
  };
};

export { historyItem };
