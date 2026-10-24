/* @layer core @kind logic */
import { addWarning } from '@bxel/document';
import type { Draft, Sprite } from '@bxel/document';
import { SLICE_EDGE_WARNING } from './compose.constants';
import type { SliceGrid } from './compose.type';

const edgeWarning = (draft: Draft, source: Sprite, grid: SliceGrid): void => {
  const right = source.width - grid.columns * grid.cellWidth;
  const bottom = source.height - grid.rows * grid.cellHeight;
  if (right > 0 || bottom > 0) {
    addWarning(draft, SLICE_EDGE_WARNING, `Sprite "${source.name}" has ${right} pixel(s) at the right and ${bottom} at the bottom that fit no cell.`);
  }
};

export { edgeWarning };
