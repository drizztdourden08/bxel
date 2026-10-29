/* @layer renderer-app @kind logic */
import { GUIDE_SNAP_REACH } from './guide.constants';

const nearestLine = (position: number, lines: readonly number[], zoom: number): number | null => {
  const near = lines.filter((line) => Math.abs(line - position) * zoom <= GUIDE_SNAP_REACH);
  return near.sort((a, b) => Math.abs(a - position) - Math.abs(b - position))[0] ?? null;
};

export { nearestLine };
