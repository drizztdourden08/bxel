/* @layer renderer-app @kind logic */
import { effectiveLock, layerKindOf, shownInTree } from '@bxel/document';
import type { Layer } from '@bxel/document';
import { LAYER_TEXT } from './layer-text.constants';

const layerBlock = (layer: Layer, layers: readonly Layer[] = [layer]): string | null => {
  if (layerKindOf(layer) !== 'pixel') return LAYER_TEXT.notPixels(layer.name);
  if (effectiveLock(layers, layer).pixels) return LAYER_TEXT.locked(layer.name);
  return shownInTree(layers, layer) ? null : LAYER_TEXT.hidden(layer.name);
};

export { layerBlock };
