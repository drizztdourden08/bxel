/* @layer renderer-app @kind logic */
import { hasActiveDocument } from '../files/has-active-document';
import { useSpriteStore } from '../stores/useSpriteStore';
import { useTilemapStore } from '../stores/useTilemapStore';
import { useToolStore } from '../stores/useToolStore';
import type { Surface } from '../editor/tool-catalogue/surface.type';

const surfaceOfModes = (): Surface => {
  if (!hasActiveDocument()) return 'none';
  const { mode } = useSpriteStore.getState();
  if (mode === 'tilemap') return useTilemapStore.getState().editMode === 'place' ? 'map' : 'tile';
  return mode === 'sheet' ? 'sheet' : 'sprite';
};

const settleMapTool = (): void => {
  const surface = surfaceOfModes();
  useToolStore.getState().enterSurface(surface);
  if (surface === 'map' && useToolStore.getState().tool === 'move') useToolStore.getState().setTool('pencil');
};

export { settleMapTool };
