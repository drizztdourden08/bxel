/* @layer renderer-app @kind logic */
import { maskBounds } from '@bxel/raster';
import type { PixelRect } from '../views/PixelViewport';
import { selectionMask } from '../editor/selection/selection-mask';
import { currentTarget } from '../editor/current-target';
import { cellBox } from '../views/TilemapCanvas/behavior/cell-box';
import { currentMap } from '../tilemap/current-map';
import { useTilemapStore } from '../stores/useTilemapStore';
import { currentSurface } from '../surface/current-surface';

const spriteRect = (): PixelRect | null => {
  const target = currentTarget();
  const mask = target ? selectionMask(target) : null;
  return mask ? maskBounds(mask) : null;
};

const mapRect = (): PixelRect | null => {
  const { selection } = useTilemapStore.getState();
  const target = currentMap();
  return selection && target ? cellBox(selection.rect, target.tileset) : null;
};

const selectionRect = (): PixelRect | null => {
  const surface = currentSurface();
  if (surface === 'map') return mapRect();
  return surface === 'sprite' || surface === 'tile' ? spriteRect() : null;
};

export { selectionRect };
