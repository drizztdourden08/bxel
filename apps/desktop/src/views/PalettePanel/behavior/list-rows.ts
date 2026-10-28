/* @layer renderer-app @kind logic */
import type { PaletteSlot } from '../../../editor/palette-slots.type';
import type { ListSort, PanelModel } from '../PalettePanel.type';
import { rampNames } from './ramp-names';

const columnValue = (panel: PanelModel, slot: PaletteSlot, key: ListSort['key']): number | string => {
  if (key === 'name') return slot.name.toLowerCase();
  if (key === 'hex') return slot.hex;
  if (key === 'alpha') return slot.alpha;
  if (key === 'use') return panel.usage?.slots[slot.index]?.pixels ?? 0;
  if (key === 'ramp') return rampNames(panel.target.bank, slot.index) || '~';
  return slot.index;
};

const compare = (first: number | string, second: number | string): number =>
  typeof first === 'number' && typeof second === 'number' ? first - second : String(first).localeCompare(String(second));

const listRows = (panel: PanelModel, sort: ListSort, filter: string): PaletteSlot[] => {
  const needle = filter.trim().toLowerCase();
  const shown = panel.slots.filter((slot) => needle === '' || slot.name.toLowerCase().includes(needle) || slot.hex.toLowerCase().includes(needle));
  const sign = sort.direction === 'descending' ? -1 : 1;
  return [...shown].sort((first, second) => sign * compare(columnValue(panel, first, sort.key), columnValue(panel, second, sort.key)) || first.index - second.index);
};

export { listRows };
