/* @layer renderer-app @kind logic */
import { PATTERN_CELLS } from './canvas-look.constants';
import { cleanBits } from './clean-bits';

const setBit = (bits: string, index: number, on: boolean): string => {
  const clean = cleanBits(bits);
  if (!Number.isInteger(index) || index < 0 || index >= PATTERN_CELLS) return clean;
  return `${clean.slice(0, index)}${on ? '1' : '0'}${clean.slice(index + 1)}`;
};

export { setBit };
