/* @layer renderer-app @kind logic */
import { useToolStore } from '../stores/useToolStore';
import { HELD_SLOTS } from './held-colours.constants';

const setHeldColour = (slot: number, index: number): void => {
  const held = HELD_SLOTS[slot - 1];
  if (held !== undefined) useToolStore.getState().setColour(held, index);
};

export { setHeldColour };
