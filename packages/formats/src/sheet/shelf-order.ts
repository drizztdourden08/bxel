/* @layer core @kind logic */
import type { PackItem } from './sheet.type';

const shelfOrder = (items: readonly PackItem[]): number[] =>
  items
    .map((_, index) => index)
    .sort((a, b) => {
      const left = items[a];
      const right = items[b];
      if (!left || !right) return 0;
      return right.height - left.height || right.width - left.width || a - b;
    });

export { shelfOrder };
