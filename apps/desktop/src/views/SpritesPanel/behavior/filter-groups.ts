/* @layer renderer-app @kind logic */
import type { MenuGroup } from '@drizztdourden08/tessera';
import { IDENTICAL_MODES } from '../../../sheet-manager/identical.constants';
import { IDENTICAL_TEXT } from '../../../sheet-manager/identical-text.constants';
import type { ManagerFilter } from '../../../sheet-manager/manager.type';
import { MANAGER_TEXT } from '../../../sheet-manager/manager-text.constants';
import { TRAIT_TEXT } from '../../../sheet-manager/trait-text.constants';
import { radioItem } from '../../../sheet/radio-item';
import { ANY_SIZE } from '../SpritesPanel.constants';
import type { FilterActions, FilterOptions } from '../SpritesPanel.type';

const traitGroups = (filter: ManagerFilter, options: FilterOptions, actions: FilterActions): MenuGroup[] => [
  {
    id: 'filter-size',
    label: MANAGER_TEXT.sizeFilter,
    items: [
      radioItem(ANY_SIZE, MANAGER_TEXT.anySize, filter.size ?? ANY_SIZE, () => actions.patch({ size: null })),
      ...options.sizes.map((size) => radioItem(size, size, filter.size ?? ANY_SIZE, (value) => actions.patch({ size: value }))),
    ],
  },
  {
    id: 'filter-tag',
    label: TRAIT_TEXT.tagFilter,
    items: [
      radioItem(ANY_SIZE, TRAIT_TEXT.anyTag, filter.tag ?? ANY_SIZE, () => actions.patch({ tag: null })),
      ...options.tags.map((tag) => radioItem(tag, tag, filter.tag ?? ANY_SIZE, (value) => actions.patch({ tag: value }))),
    ],
  },
  {
    id: 'filter-bank',
    label: TRAIT_TEXT.bankFilter,
    items: [
      radioItem(ANY_SIZE, TRAIT_TEXT.anyBank, filter.bank ?? ANY_SIZE, () => actions.patch({ bank: null })),
      ...options.banks.map((bank) => radioItem(bank.id, bank.name, filter.bank ?? ANY_SIZE, (value) => actions.patch({ bank: value }))),
    ],
  },
];

const filterGroups = (filter: ManagerFilter, options: FilterOptions, actions: FilterActions): MenuGroup[] => [
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
  ...traitGroups(filter, options, actions),
  { id: 'filter-clear', items: [{ id: 'clear', label: MANAGER_TEXT.clearFilters, onSelect: actions.clear }] },
];

export { filterGroups };
