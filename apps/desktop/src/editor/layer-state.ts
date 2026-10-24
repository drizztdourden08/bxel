/* @layer renderer-app @kind logic */
import type { Layer } from '@bxel/document';
import { LAYER_STATE } from './layer-text.constants';

const layerState = (layer: Layer): string => {
  if (layer.locked) return LAYER_STATE.locked;
  return layer.visible ? '' : LAYER_STATE.hidden;
};

export { layerState };
