/* @layer renderer-app @kind logic */
import type { Wrap } from '@bxel/raster';
import { neighbourWrap } from '../tilemap/neighbour-wrap';
import { useDrawingStore } from '../stores/useDrawingStore';
import { useTilemapStore } from '../stores/useTilemapStore';
import { useViewStore } from '../stores/useViewStore';
import { NO_WRAP } from './wrap-of.constants';
import { WRAP_OF } from './wrap.constants';

const wrapOf = (): Wrap => {
  const tiled = WRAP_OF[useViewStore.getState().tiled];
  if (useTilemapStore.getState().editMode !== 'edit') return tiled;
  if (useDrawingStore.getState().lockToTile) return NO_WRAP;
  const next = neighbourWrap();
  return { x: tiled.x || next.x === true, y: tiled.y || next.y === true };
};

export { wrapOf };
