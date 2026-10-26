/* @layer core @kind logic */
import type { SheetBox, SheetPartOverlap } from './sheet-overlap.type';

const boxOverlaps = (boxes: readonly SheetBox[]): SheetPartOverlap[] => {
  const found: SheetPartOverlap[] = [];
  for (const [index, first] of boxes.entries()) {
    for (const second of boxes.slice(index + 1)) {
      const apart = first.right <= second.left || second.right <= first.left || first.bottom <= second.top || second.bottom <= first.top;
      if (!apart) found.push({ first: first.part, second: second.part });
    }
  }
  return found;
};

export { boxOverlaps };
