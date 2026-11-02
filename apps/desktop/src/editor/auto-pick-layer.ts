/* @layer renderer-app @kind logic */
import type { Point } from '@bxel/raster';
import { useDrawingStore } from '../stores/useDrawingStore';
import { useToolStore } from '../stores/useToolStore';
import { currentTarget } from './current-target';
import { layerUnderPointer } from './layer-under-pointer';

const autoPickLayer = (at: Point): boolean => {
  if (!useDrawingStore.getState().moveAutoPick) return false;
  const target = currentTarget();
  const found = target === null ? null : layerUnderPointer(target.sprite, target.frameId, at);
  if (found === null || found === target?.layerId) return false;
  useToolStore.getState().setLayer(found);
  return true;
};

export { autoPickLayer };
