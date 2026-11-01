/* @layer renderer-app @kind logic */
import { COMMAND_NAME, siblingBelow } from '@bxel/document';
import { useToolStore } from '../stores/useToolStore';
import { currentTarget } from './current-target';
import { LAYER_LABEL } from './layer-text.constants';
import { runLayer } from './run-layer';

const mergeLayerDown = (): void => {
  const target = currentTarget();
  if (!target) return;
  const { layers } = target.sprite;
  const below = siblingBelow(layers, layers.findIndex((layer) => layer.id === target.layerId));
  const options = { layer: { by: 'id', id: target.layerId } };
  const done = runLayer(target, LAYER_LABEL.merge, { name: COMMAND_NAME.layerMerge, options });
  if (done && below) useToolStore.getState().setLayer(below.id);
};

export { mergeLayerDown };
