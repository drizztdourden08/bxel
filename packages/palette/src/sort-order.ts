/* @layer core @kind logic */
import type { PaletteBank, SwatchId } from '@bxel/document';
import type { PaletteSortRequest } from './palette-sort.type';
import { sortValue } from './sort-value';

const compare = (first: number | string, second: number | string): number => {
  if (typeof first === 'string' || typeof second === 'string') return String(first).localeCompare(String(second));
  return first - second;
};

const movable = (bank: PaletteBank, request: PaletteSortRequest): number[] => {
  const chosen = request.swatches ? new Set(request.swatches) : null;
  return bank.slots.flatMap((slot, index) => (index > 0 && slot.kind === 'color' && (!chosen || chosen.has(slot.id)) ? [index] : []));
};

const sortOrder = (bank: PaletteBank, request: PaletteSortRequest): SwatchId[] => {
  const positions = movable(bank, request);
  const sign = request.direction === 'descending' ? -1 : 1;
  const ranked = positions.map((index) => {
    const swatch = bank.slots[index];
    const value = swatch?.kind === 'color' ? sortValue(request.key, { bank, swatch, index, usage: request.usage }) : 0;
    return { index, value };
  });
  ranked.sort((first, second) => sign * compare(first.value, second.value) || first.index - second.index);
  const order = bank.slots.map((slot) => slot.id);
  positions.forEach((position, at) => {
    const from = ranked[at]?.index ?? position;
    const id = bank.slots[from]?.id;
    if (id !== undefined) order[position] = id;
  });
  return order;
};

export { sortOrder };
