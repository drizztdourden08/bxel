/* @layer core @kind logic */
import { expandLevel } from './expand-level';

const snapChannel = (value: number, bits: number): number => {
  if (bits >= 8) return value;
  const level = Math.round((value * (2 ** bits - 1)) / 255);
  return expandLevel(level, bits);
};

export { snapChannel };
