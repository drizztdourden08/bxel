/* @layer renderer-app @kind logic */
import { PATTERN_SIZE } from './canvas-look.constants';

const cellAt = (x: number, y: number, extent: number): number | null => {
  if (extent <= 0 || x < 0 || y < 0 || x >= extent || y >= extent) return null;
  const column = Math.floor((x / extent) * PATTERN_SIZE);
  const row = Math.floor((y / extent) * PATTERN_SIZE);
  return row * PATTERN_SIZE + column;
};

export { cellAt };
