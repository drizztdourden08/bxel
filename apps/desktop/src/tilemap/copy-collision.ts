/* @layer renderer-app @kind logic */
import { tileShapes } from '@bxel/document';
import { useNoticeStore } from '../stores/useNoticeStore';
import { useTilesetViewStore } from '../stores/useTilesetViewStore';
import { tileOf } from './tile-of';
import { TILE_LABEL } from './tilemap.constants';

const copyCollision = (key?: number): boolean => {
  const tile = tileOf(key);
  if (tile === null) return false;
  useTilesetViewStore.getState().setShapeClipboard(tileShapes(tile));
  useNoticeStore.getState().post(TILE_LABEL.copiedCollision);
  return true;
};

export { copyCollision };
