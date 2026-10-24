/* @layer renderer-app @kind logic */
import { CELL_STEPS, PATTERN_SIZE } from './canvas-look.constants';

const clampCell = (value: number): number => Math.min(PATTERN_SIZE - 1, Math.max(0, value));

const stepCell = (index: number, key: string): number => {
  const step = CELL_STEPS[key];
  if (!step) return index;
  const column = clampCell((index % PATTERN_SIZE) + step[0]);
  const row = clampCell(Math.floor(index / PATTERN_SIZE) + step[1]);
  return row * PATTERN_SIZE + column;
};

export { stepCell };
