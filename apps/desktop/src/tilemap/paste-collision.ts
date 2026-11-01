/* @layer renderer-app @kind logic */
import { useTilesetViewStore } from '../stores/useTilesetViewStore';
import { setShapes } from './set-shapes';
import { targetKeys } from './target-keys';
import { tileOf } from './tile-of';

const pasteCollision = (key?: number): boolean => {
  const tile = tileOf(key);
  const shapes = useTilesetViewStore.getState().shapeClipboard;
  return tile === null || shapes.length === 0 ? false : setShapes(targetKeys(tile), shapes, 'set');
};

export { pasteCollision };
