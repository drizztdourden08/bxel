/* @layer renderer-app @kind logic */
import type { Point } from '@bxel/document';
import { useTilemapStore } from '../stores/useTilemapStore';
import { currentMap } from './current-map';
import { topLayerAt } from './top-layer-at';

const pickMapLayer = (at: Point): boolean => {
  const target = currentMap();
  const found = target ? topLayerAt(target.tilemap, at) : null;
  if (!found) return false;
  useTilemapStore.getState().setLayer(found.id);
  return true;
};

export { pickMapLayer };
