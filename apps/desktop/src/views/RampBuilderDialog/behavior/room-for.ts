/* @layer renderer-app @kind logic */
import { MAX_BANK_CAP } from '@bxel/document';
import type { PaletteBank } from '@bxel/document';

const roomFor = (bank: PaletteBank, added: number): number | null => {
  const needed = bank.slots.length + added;
  return needed > bank.cap && needed <= MAX_BANK_CAP ? needed : null;
};

export { roomFor };
