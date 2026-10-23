/* @layer core @kind logic */
import type { ColorBox } from './extract.type';

const pickBox = (boxes: readonly ColorBox[]): number => {
  let best = -1;
  let bestScore = -1;
  for (const [position, box] of boxes.entries()) {
    if (box.entries.length < 2) continue;
    const score = box.population * box.span;
    if (score > bestScore) {
      best = position;
      bestScore = score;
    }
  }
  return best;
};

export { pickBox };
