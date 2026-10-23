/* @layer renderer-app @kind logic */
import type { ColourSlot } from './press-plan.type';

const swatchRole = (index: number, foreground: number, background: number): ColourSlot | null => {
  if (index === foreground) return 'foreground';
  return index === background ? 'background' : null;
};

export { swatchRole };
