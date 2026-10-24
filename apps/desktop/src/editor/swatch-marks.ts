/* @layer renderer-app @kind logic */
import { HELD_SLOTS } from './held-colours.constants';
import type { ColourSlot } from './press-plan.type';

const swatchMarks = (index: number, held: Readonly<Record<ColourSlot, number>>): number[] =>
  HELD_SLOTS.flatMap((slot, position) => (held[slot] === index ? [position + 1] : []));

export { swatchMarks };
