/* @layer renderer-app @kind logic */
import { COMMAND_NAME } from '@bxel/document';
import { useToolStore } from '../stores/useToolStore';
import { currentTarget } from './current-target';
import { LAYER_LABEL } from './layer-text.constants';
import { runLayer } from './run-layer';

const mergeLayerDown = (): void => {
  const target = currentTarget();
  if (!target) return;
  const { layers } = target.sprite;
  const below = layers[layers.findIndex((layer) => layer.id === target.layerId) - 1];
  const options = { layer: { by: 'id', id: target.layerId } };
  const done = runLayer(target, LAYER_LABEL.merge, { name: COMMAND_NAME.layerMerge, options });
  if (done && below) useToolStore.getState().setLayer(below.id);
};

export { mergeLayerDown };
