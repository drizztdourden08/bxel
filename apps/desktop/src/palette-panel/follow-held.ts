/* @layer renderer-app @kind logic */
import type { PaletteBank } from '@bxel/document';
import { HELD_SLOTS } from '../editor/held-colours.constants';
import { useToolStore } from '../stores/useToolStore';

const followHeld = (before: PaletteBank, after: PaletteBank): void => {
  const tools = useToolStore.getState();
  for (const slot of HELD_SLOTS) {
    const id = before.slots[tools[slot]]?.id;
    const next = id === undefined ? -1 : after.slots.findIndex((swatch) => swatch.id === id);
    if (next >= 0 && next !== tools[slot]) tools.setColour(slot, next);
  }
};

export { followHeld };
