/* @layer renderer-app @kind logic */
import type { MenuGroup } from '@drizztdourden08/tessera';
import { MANAGER_TEXT } from '../../../sheet-manager/manager-text.constants';
import { SORT_KEYS, ZOOM } from '../../../sheet-manager/manager.constants';
import { SHEET_TEXT } from '../../../sheet-manager/sheet-text.constants';
import type { ManagerState } from '../../../stores/manager-store.type';
import { radioItem } from '../../../sheet/radio-item';

const overflowGroups = (store: Pick<ManagerState, 'sortKey' | 'sortDown' | 'zoom' | 'patch'>): MenuGroup[] => [
  {
    id: 'overflow-size',
    label: SHEET_TEXT.thumbnailSize,
    items: [
      {
        id: 'zoom',
        label: SHEET_TEXT.thumbnailSize,
        kind: 'slider',
        min: ZOOM.min,
        max: ZOOM.max,
        step: ZOOM.step,
        value: store.zoom,
        formatValue: SHEET_TEXT.sizeLabel,
        onChange: (zoom) => store.patch({ zoom }),
      },
    ],
  },
  {
    id: 'overflow-sort',
    label: SHEET_TEXT.sort,
    items: [
      ...SORT_KEYS.map((key) => radioItem(key, MANAGER_TEXT.sortLabels[key], store.sortKey, (sortKey) => store.patch({ sortKey }))),
      { id: 'reverse', label: SHEET_TEXT.reverse, kind: 'check', checked: store.sortDown, onSelect: () => store.patch({ sortDown: !store.sortDown }) },
    ],
  },
];

export { overflowGroups };
