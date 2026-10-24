/* @layer renderer-app @kind logic */
import { COMMAND_NAME } from '@bxel/document';
import { currentTarget } from './current-target';
import { LAYER_LABEL } from './layer-text.constants';
import { runLayer } from './run-layer';

const moveLayer = (from: number, to: number): void => {
  const target = currentTarget();
  if (!target) return;
  const { layers } = target.sprite;
  const moved = layers[layers.length - 1 - from];
  if (!moved) return;
  const options = { layer: { by: 'id', id: moved.id }, to: layers.length - 1 - to };
  runLayer(target, LAYER_LABEL.move, { name: COMMAND_NAME.layerReorder, options });
};

export { moveLayer };
