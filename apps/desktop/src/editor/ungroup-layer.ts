/* @layer renderer-app @kind logic */
import { COMMAND_NAME } from '@bxel/document';
import { currentTarget } from './current-target';
import { LAYER_LABEL } from './layer-text.constants';
import { runLayer } from './run-layer';

const ungroupLayer = (id: string): void => {
  const target = currentTarget();
  if (!target) return;
  runLayer(target, LAYER_LABEL.ungroup, { name: COMMAND_NAME.layerUngroup, options: { layer: { by: 'id', id } } });
};

export { ungroupLayer };
