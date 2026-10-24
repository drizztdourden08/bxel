/* @layer renderer-app @kind logic */
import type { ColourSlot, PressEvent } from './press-plan.type';
import { SECONDARY_BUTTON } from './tools.constants';

const drawSlot = (event: PressEvent): ColourSlot => {
  const second = event.button === SECONDARY_BUTTON;
  if (event.ctrlKey === true || event.metaKey === true) return second ? 'fourth' : 'third';
  return second ? 'background' : 'foreground';
};

export { drawSlot };
