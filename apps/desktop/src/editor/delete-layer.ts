/* @layer renderer-app @kind logic */
import { COMMAND_NAME } from '@bxel/document';
import { useToolStore } from '../stores/useToolStore';
import { currentTarget } from './current-target';
import { LAYER_LABEL } from './layer-text.constants';
import { runLayer } from './run-layer';

const deleteLayer = (): void => {
  const target = currentTarget();
  if (!target) return;
  const { layers } = target.sprite;
  const index = layers.findIndex((layer) => layer.id === target.layerId);
  const next = layers[index - 1] ?? layers[index + 1];
  const options = { layer: { by: 'id', id: target.layerId } };
  const done = runLayer(target, LAYER_LABEL.remove, { name: COMMAND_NAME.layerDelete, options });
  if (done && next) useToolStore.getState().setLayer(next.id);
};

export { deleteLayer };
