/* @layer renderer-app @kind logic */
import type { Size } from '@bxel/raster';
import { useDrawingStore } from '../stores/useDrawingStore';
import { useSnapGridStore } from '../stores/useSnapGridStore';
import { useTilemapStore } from '../stores/useTilemapStore';
import { useViewStore } from '../stores/useViewStore';

const tileCellOf = (): Size | null => {
  if (!useDrawingStore.getState().symmetryTile) return null;
  const { grid } = useSnapGridStore.getState();
  if (!grid || grid.width < 1 || grid.height < 1) return null;
  return useViewStore.getState().gridTile || useTilemapStore.getState().editMode === 'edit' ? grid : null;
};

export { tileCellOf };
