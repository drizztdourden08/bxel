/* @layer renderer-app @kind logic */
import { IDENTICAL_TEXT } from '../../../sheet-manager/identical-text.constants';
import type { ManagerFilter } from '../../../sheet-manager/manager.type';
import { SHEET_TEXT } from '../../../sheet-manager/sheet-text.constants';
import type { FilterChip } from '../SpritesPanel.type';

const filterChips = (filter: ManagerFilter, banks: readonly { id: string; name: string }[], patch: (change: Partial<ManagerFilter>) => void): FilterChip[] => {
  const chips: FilterChip[] = [];
  if (filter.kind !== 'all') chips.push({ id: 'kind', label: SHEET_TEXT.chips[filter.kind], clear: () => patch({ kind: 'all' }) });
  if (filter.slices) chips.push({ id: 'slices', label: SHEET_TEXT.chips.slices, clear: () => patch({ slices: false }) });
  if (filter.identical !== 'off') chips.push({ id: 'identical', label: `${SHEET_TEXT.chips.identical}: ${IDENTICAL_TEXT.modes[filter.identical]}`, clear: () => patch({ identical: 'off' }) });
  if (filter.size !== null) chips.push({ id: 'size', label: SHEET_TEXT.chips.size(filter.size), clear: () => patch({ size: null }) });
  if (filter.tag !== null) chips.push({ id: 'tag', label: SHEET_TEXT.chips.tag(filter.tag), clear: () => patch({ tag: null }) });
  if (filter.bank !== null) {
    const name = banks.find((bank) => bank.id === filter.bank)?.name ?? filter.bank;
    chips.push({ id: 'bank', label: SHEET_TEXT.chips.bank(name), clear: () => patch({ bank: null }) });
  }
  return chips;
};

export { filterChips };
