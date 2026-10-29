/* @layer core @kind logic */
import type { Rect } from '../../geometry.type';
import { NEIGHBOURS } from './find-islands.constants';
import type { IslandGrid } from './island-grid.type';

const flood = (grid: IslandGrid, start: number): Rect => {
  const { mask, seen, width, height } = grid;
  const stack = [start];
  seen[start] = 1;
  let left = width;
  let top = height;
  let right = 0;
  let bottom = 0;
  while (stack.length > 0) {
    const at = stack.pop() ?? 0;
    const x = at % width;
    const y = Math.floor(at / width);
    left = Math.min(left, x);
    right = Math.max(right, x);
    top = Math.min(top, y);
    bottom = Math.max(bottom, y);
    for (const [dx, dy] of NEIGHBOURS) {
      const nx = x + dx;
      const ny = y + dy;
      const next = ny * width + nx;
      if (nx < 0 || ny < 0 || nx >= width || ny >= height || mask[next] === 0 || seen[next] === 1) continue;
      seen[next] = 1;
      stack.push(next);
    }
  }
  return { x: left, y: top, width: right - left + 1, height: bottom - top + 1 };
};

export { flood };
