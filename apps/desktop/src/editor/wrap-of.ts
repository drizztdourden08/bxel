/* @layer renderer-app @kind logic */
import type { Wrap } from '@bxel/raster';
import { useDrawingStore } from '../stores/useDrawingStore';
import { useTilemapStore } from '../stores/useTilemapStore';
import { useViewStore } from '../stores/useViewStore';
import { NO_WRAP } from './wrap-of.constants';
import { WRAP_OF } from './wrap.constants';

const wrapOf = (): Wrap => {
  const locked = useDrawingStore.getState().lockToTile && useTilemapStore.getState().editMode === 'edit';
  return locked ? NO_WRAP : WRAP_OF[useViewStore.getState().tiled];
};

export { wrapOf };
