/* @layer renderer-app @kind logic */
import type { MenuGroup } from '@drizztdourden08/tessera';
import { IDENTICAL_MODES } from '../../../sheet-manager/identical.constants';
import { IDENTICAL_TEXT } from '../../../sheet-manager/identical-text.constants';
import type { ManagerFilter } from '../../../sheet-manager/manager.type';
import { MANAGER_TEXT } from '../../../sheet-manager/manager-text.constants';
import { radioItem } from '../../../sheet/radio-item';
import { ANY_SIZE } from '../SpritesPanel.constants';
import type { FilterActions } from '../SpritesPanel.type';

const filterGroups = (filter: ManagerFilter, sizes: readonly string[], actions: FilterActions): MenuGroup[] => [
  {
    id: 'filter-flags',
    label: MANAGER_TEXT.filters,
    items: [
      { id: 'animated', label: MANAGER_TEXT.animated, kind: 'check', checked: filter.animated, onSelect: () => actions.patch({ animated: !filter.animated }) },
      { id: 'unplaced', label: MANAGER_TEXT.unplaced, kind: 'check', checked: filter.unplaced, onSelect: () => actions.patch({ unplaced: !filter.unplaced }) },
    ],
  },
  {
    id: 'filter-identical',
    label: IDENTICAL_TEXT.filter,
    items: IDENTICAL_MODES.map((mode) => radioItem(mode, IDENTICAL_TEXT.modes[mode], filter.identical, (value) => actions.patch({ identical: value }))),
  },
  {
    id: 'filter-size',
    label: MANAGER_TEXT.sizeFilter,
    items: [
      radioItem(ANY_SIZE, MANAGER_TEXT.anySize, filter.size ?? ANY_SIZE, () => actions.patch({ size: null })),
      ...sizes.map((size) => radioItem(size, size, filter.size ?? ANY_SIZE, (value) => actions.patch({ size: value }))),
    ],
  },
  { id: 'filter-clear', items: [{ id: 'clear', label: MANAGER_TEXT.clearFilters, onSelect: actions.clear }] },
];

export { filterGroups };
