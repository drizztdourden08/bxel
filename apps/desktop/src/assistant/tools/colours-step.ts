/* @layer renderer-app @kind logic */
import { currentTarget } from '../../editor/current-target';
import { useToolStore } from '../../stores/useToolStore';
import { COLOUR_SLOTS } from './state-steps.constants';
import { viewFail } from './view-fail';
import type { ViewStep } from './view-steps.type';

const coloursStep: ViewStep = (patch) => {
  const { colours } = patch;
  if (!colours) return null;
  const size = currentTarget()?.bank.slots.length ?? 256;
  for (const slot of COLOUR_SLOTS) {
    const index = colours[slot];
    if (index !== undefined && index >= size) return viewFail(`The palette has ${size} colours, so ${slot} cannot be ${index}.`, `colours.${slot}`);
  }
  const store = useToolStore.getState();
  for (const slot of COLOUR_SLOTS) {
    const index = colours[slot];
    if (index !== undefined) store.setColour(slot, index);
  }
  return null;
};

export { coloursStep };
