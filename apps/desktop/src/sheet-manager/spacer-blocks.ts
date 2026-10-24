/* @layer renderer-app @kind logic */
import { SPACER_SIZES } from './virtual-grid.constants';
import type { SpacerBlock } from './virtual-grid.type';

const spacerBlocks = (at: number, rows: number): SpacerBlock[] => {
  if (rows < 1) return [];
  const blocks: SpacerBlock[] = [{ at, size: 1 }];
  let next = at + 1;
  let rest = rows - 1;
  for (const size of SPACER_SIZES) {
    while (rest >= size) {
      blocks.push({ at: next, size });
      next += size;
      rest -= size;
    }
  }
  return blocks;
};

export { spacerBlocks };
