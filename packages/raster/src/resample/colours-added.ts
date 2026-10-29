/* @layer core @kind logic */
import { PALETTE_SLOTS } from './colours-added.constants';

const coloursAdded = (before: Uint8Array, after: Uint8Array): number => {
  const known = new Uint8Array(PALETTE_SLOTS);
  for (const value of before) known[value] = 1;
  const seen = new Uint8Array(PALETTE_SLOTS);
  let added = 0;
  for (const value of after) {
    if (known[value] === 0 && seen[value] === 0) {
      seen[value] = 1;
      added++;
    }
  }
  return added;
};

export { coloursAdded };
