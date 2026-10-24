/* @layer renderer-app @kind logic */
import type { PaletteBank } from '@bxel/document';

const slotPairs = (source: PaletteBank, dest: PaletteBank): { from: string; to: string }[] =>
  source.slots.slice(1, dest.slots.length).map((slot, at) => ({ from: slot.id, to: dest.slots[at + 1]?.id ?? slot.id }));

export { slotPairs };
