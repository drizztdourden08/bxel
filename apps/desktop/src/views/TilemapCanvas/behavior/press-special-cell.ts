/* @layer renderer-app @kind logic */
import type { Point } from '@bxel/document';
import { useTilemapStore } from '../../../stores/useTilemapStore';
import { useToolStore } from '../../../stores/useToolStore';
import { selectAtCell } from '../../../tilemap/select-at-cell';
import { MAP_TOOL_OF } from '../../../tilemap/tilemap.constants';
import { placePaste } from './place-paste';

const pressSpecialCell = (cell: Point): boolean => {
  const store = useTilemapStore.getState();
  if (store.paste) {
    placePaste(cell);
    return true;
  }
  if (MAP_TOOL_OF[useToolStore.getState().tool] !== 'select' || store.selectVariant === 'rect') return false;
  selectAtCell(cell, store.selectMode);
  return true;
};

export { pressSpecialCell };
