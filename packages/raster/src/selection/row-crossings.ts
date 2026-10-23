/* @layer core @kind logic */
import type { Corners } from '../geometry.type';

const rowCrossings = (edges: readonly Corners[], y: number): number[] => {
  const crossings: number[] = [];
  for (const { from, to } of edges) {
    if (y >= Math.min(from.y, to.y) && y < Math.max(from.y, to.y)) {
      crossings.push(from.x + ((y - from.y) * (to.x - from.x)) / (to.y - from.y));
    }
  }
  return crossings.sort((first, second) => first - second);
};

export { rowCrossings };
