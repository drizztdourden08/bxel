/* @layer renderer-app @kind logic */
import type { SwatchClick } from './swatch-slot.type';
import type { ColourSlot } from './press-plan.type';

const swatchSlot = ({ right, shift }: SwatchClick): ColourSlot => {
  if (shift) return right ? 'fourth' : 'third';
  return right ? 'background' : 'foreground';
};

export { swatchSlot };
