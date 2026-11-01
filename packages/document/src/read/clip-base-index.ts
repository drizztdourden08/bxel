/* @layer core @kind logic */
import type { Layer } from '../model/sprite.type';
import { layerKindOf } from './layer-kind-of';

const clipBaseIndex = (layers: readonly Layer[], index: number): number => {
  const layer = layers[index];
  if (!layer?.clip) return -1;
  for (let at = index - 1; at >= 0; at -= 1) {
    const below = layers[at];
    if (!below || below.parentId !== layer.parentId) continue;
    if (layerKindOf(below) !== 'pixel') return -1;
    if (!below.clip) return at;
  }
  return -1;
};

export { clipBaseIndex };
