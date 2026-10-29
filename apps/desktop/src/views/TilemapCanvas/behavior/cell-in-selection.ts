/* @layer renderer-app @kind logic */
import type { Point } from '@bxel/document';
import type { MapSelection } from '../../../stores/tilemap-store.type';

const cellInSelection = (cell: Point | null, selection: MapSelection | null): boolean => {
  if (cell === null || selection === null) return false;
  const { rect, mask } = selection;
  if (cell.x < rect.x || cell.y < rect.y || cell.x >= rect.x + rect.width || cell.y >= rect.y + rect.height) return false;
  return mask === null || mask[(cell.y - rect.y) * rect.width + (cell.x - rect.x)] === 1;
};

export { cellInSelection };
