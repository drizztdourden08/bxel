/* @layer renderer-app @kind logic */
import { currentTileset } from '../../../tilemap/current-tileset';
import { tileOf } from '../../../tilemap/tile-of';
import { addShape } from './add-shape';

const addPickedBox = (): boolean => {
  const tile = tileOf(undefined);
  const tileset = currentTileset();
  if (!tile || !tileset) return false;
  const width = Math.max(1, Math.floor(tileset.tileWidth / 2));
  const height = Math.max(1, Math.floor(tileset.tileHeight / 2));
  return addShape(tile, { kind: 'rect', x: 0, y: 0, width, height });
};

export { addPickedBox };
