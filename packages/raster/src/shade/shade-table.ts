/* @layer core @kind logic */
import type { ShadeSteps } from './shade.type';

const shadeTable = ({ slots, direction, steps }: ShadeSteps): Uint8Array => {
  const table = Uint8Array.from({ length: 256 }, (_, slot) => slot);
  const shift = direction === 'up' ? steps : -steps;
  for (const [at, slot] of slots.entries()) {
    const moved = Math.min(slots.length - 1, Math.max(0, at + shift));
    table[slot] = slots[moved] ?? slot;
  }
  return table;
};

export { shadeTable };
