/* @layer renderer-app @kind logic */
import { cellKey, cellMaskBounds } from '@bxel/document';
import type { MapSelection } from '../stores/tilemap-store.type';
import type { MapTarget } from './tilemap.type';

const selectionOfMask = (full: Uint8Array, target: Pick<MapTarget, 'tilemap' | 'layer'>): MapSelection | null => {
  const { columns } = target.tilemap;
  const rect = cellMaskBounds(full, columns);
  if (!rect) return null;
  const cropped = new Uint8Array(rect.width * rect.height);
  let all = true;
  let first = -1;
  for (let row = 0; row < rect.height; row += 1) {
    for (let column = 0; column < rect.width; column += 1) {
      const index = (rect.y + row) * columns + rect.x + column;
      const bit = full[index] === 1 ? 1 : 0;
      cropped[row * rect.width + column] = bit;
      if (bit === 0) all = false;
      else if (first < 0) first = index;
    }
  }
  return { rect, from: cellKey(target.layer.cells[first] ?? 0), mask: all ? null : cropped };
};

export { selectionOfMask };
