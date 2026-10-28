/* @layer renderer-app @kind logic */
import type { PaletteBank } from '@bxel/document';
import { usePaletteSelectionStore } from '../stores/usePaletteSelectionStore';

const selectedIndices = (bank: PaletteBank): number[] => {
  const { bankId, selected } = usePaletteSelectionStore.getState();
  if (bankId !== bank.id) return [];
  return bank.slots.flatMap((slot, index) => (selected.includes(slot.id) ? [index] : []));
};

export { selectedIndices };
