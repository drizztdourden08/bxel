/* @layer renderer-app @kind logic */
import type { WindowPart } from './virtual-grid.type';

const windowParts = (indices: readonly number[], count: number): WindowPart[] => {
  const parts: WindowPart[] = [];
  let previous = -1;
  for (const at of indices) {
    if (at - previous > 1) parts.push({ kind: 'space', at: previous + 1, rows: at - previous - 1 });
    parts.push({ kind: 'row', at, rows: 1 });
    previous = at;
  }
  if (count - previous > 1) parts.push({ kind: 'space', at: previous + 1, rows: count - previous - 1 });
  return parts;
};

export { windowParts };
