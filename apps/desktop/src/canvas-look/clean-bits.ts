/* @layer renderer-app @kind logic */
import { BLANK_PATTERN, PATTERN_CELLS } from './canvas-look.constants';

const cleanBits = (value: unknown): string => {
  if (typeof value !== 'string') return BLANK_PATTERN;
  return value
    .slice(0, PATTERN_CELLS)
    .replace(/[^1]/g, '0')
    .padEnd(PATTERN_CELLS, '0');
};

export { cleanBits };
