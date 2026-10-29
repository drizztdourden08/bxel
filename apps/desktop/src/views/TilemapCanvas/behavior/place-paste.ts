/* @layer renderer-app @kind logic */
import type { Point } from '@bxel/document';
import { useTilemapStore } from '../../../stores/useTilemapStore';
import { placeClip } from '../../../tilemap/place-clip';

const placePaste = (cell: Point): boolean => {
  const store = useTilemapStore.getState();
  const { paste } = store;
  if (!paste) return false;
  const placed = placeClip(paste, cell);
  store.setPaste(null);
  return placed;
};

export { placePaste };
