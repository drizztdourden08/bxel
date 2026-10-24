/* @layer renderer-app @kind logic */
import type { MenuGroup } from '@drizztdourden08/tessera';
import { SORT_KEYS } from '../../../sheet-manager/manager.constants';
import type { SortKey } from '../../../sheet-manager/manager.type';
import { MANAGER_TEXT } from '../../../sheet-manager/manager-text.constants';
import { radioItem } from '../../../sheet/radio-item';

const sortGroups = (sortKey: SortKey, sortDown: boolean, patch: (change: { sortKey?: SortKey; sortDown?: boolean }) => void): MenuGroup[] => [
  {
    id: 'sort-key',
    label: MANAGER_TEXT.sort,
    items: SORT_KEYS.map((key) => radioItem(key, MANAGER_TEXT.sortLabels[key], sortKey, (value) => patch({ sortKey: value }))),
  },
  {
    id: 'sort-direction',
    items: [
      radioItem('up', MANAGER_TEXT.ascending, sortDown ? 'down' : 'up', () => patch({ sortDown: false })),
      radioItem('down', MANAGER_TEXT.descending, sortDown ? 'down' : 'up', () => patch({ sortDown: true })),
    ],
  },
];

export { sortGroups };
