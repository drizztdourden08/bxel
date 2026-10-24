/* @layer renderer-app @kind logic */
import type { Layer } from '@bxel/document';
import { LAYER_TEXT } from './layer-text.constants';

const layerBlock = (layer: Layer): string | null => {
  if (layer.locked) return LAYER_TEXT.locked(layer.name);
  return layer.visible ? null : LAYER_TEXT.hidden(layer.name);
};

export { layerBlock };
