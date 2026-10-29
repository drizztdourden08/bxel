/* @layer core @kind logic */
import type { Rect } from '../../geometry.type';

const readingOrder = (boxes: readonly Rect[]): Rect[] => {
  const byTop = [...boxes].sort((a, b) => a.y - b.y || a.x - b.x);
  const rows: Rect[][] = [];
  for (const box of byTop) {
    const row = rows.at(-1);
    const head = row?.[0];
    if (row && head && box.y < head.y + head.height / 2) row.push(box);
    else rows.push([box]);
  }
  return rows.flatMap((row) => row.sort((a, b) => a.x - b.x));
};

export { readingOrder };
