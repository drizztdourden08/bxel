/* @layer renderer-app @kind logic */
import type { PaletteBank } from '@bxel/document';

const swappedOrder = (bank: PaletteBank, first: number, second: number): string[] => {
  const ids = bank.slots.map((slot) => String(slot.id));
  const one = ids[first];
  const two = ids[second];
  if (one === undefined || two === undefined) return ids;
  ids[first] = two;
  ids[second] = one;
  return ids;
};

export { swappedOrder };
