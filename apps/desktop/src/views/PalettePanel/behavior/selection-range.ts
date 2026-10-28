/* @layer renderer-app @kind logic */
import type { PaletteBank } from '@bxel/document';

const selectionRange = (bank: PaletteBank, anchor: number, to: number): string[] => {
  const low = Math.min(anchor, to);
  const high = Math.max(anchor, to);
  return bank.slots.slice(low, high + 1).map((slot) => String(slot.id));
};

export { selectionRange };
