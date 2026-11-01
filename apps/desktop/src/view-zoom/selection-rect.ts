/* @layer renderer-app @kind logic */
import { maskBounds } from '@bxel/raster';
import type { PixelRect } from '../views/PixelViewport';
import { selectionMask } from '../editor/selection/selection-mask';
import { currentTarget } from '../editor/current-target';
import { cellBox } from '../views/TilemapCanvas/behavior/cell-box';
import { currentModel } from '../sheet/current-model';
import { currentScene } from '../sheet/current-scene';
import { currentMap } from '../tilemap/current-map';
import { useTilemapStore } from '../stores/useTilemapStore';
import { currentCanvasSurface } from '../canvas-surface/current-canvas-surface';

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

const sheetRect = (): PixelRect | null => {
  const current = currentModel();
  const chosen = new Set(currentScene()?.selected.map((sprite) => sprite.id));
  const items = current ? current.model.items.filter((item) => chosen.has(item.sprite.id)) : [];
  if (items.length === 0) return null;
  const left = Math.min(...items.map((item) => item.at.x));
  const top = Math.min(...items.map((item) => item.at.y));
  const right = Math.max(...items.map((item) => item.at.x + item.sprite.width));
  const bottom = Math.max(...items.map((item) => item.at.y + item.sprite.height));
  return { x: left, y: top, width: right - left, height: bottom - top };
};

const selectionRect = (): PixelRect | null => {
  const surface = currentCanvasSurface();
  if (surface === 'map') return mapRect();
  if (surface === 'sheet') return sheetRect();
  return surface === 'sprite' || surface === 'tile' ? spriteRect() : null;
};

export { selectionRect };
