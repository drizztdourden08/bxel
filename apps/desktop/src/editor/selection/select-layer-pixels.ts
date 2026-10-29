/* @layer renderer-app @kind logic */
import type { CombineMode } from '@bxel/raster';
import { currentTarget } from '../current-target';
import { commitSelection } from './commit-selection';
import { mergeMask } from './merge-mask';
import { opaqueOf } from './opaque-of';
import { selectionMask } from './selection-mask';

const selectLayerPixels = (layerId: string, mode: CombineMode): boolean => {
  const target = currentTarget();
  const layer = target?.sprite.layers.find((each) => each.id === layerId);
  const celId = target ? layer?.cels[target.frameId] : undefined;
  const pixels = target && celId ? target.sprite.cels[celId]?.pixels : undefined;
  if (!target || !pixels) return false;
  commitSelection(target, mergeMask(selectionMask(target), opaqueOf(pixels, target.sprite.width, target.sprite.height), mode));
  return true;
};

export { selectLayerPixels };
