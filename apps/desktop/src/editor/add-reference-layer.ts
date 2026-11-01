/* @layer renderer-app @kind logic */
import { COMMAND_NAME } from '@bxel/document';
import { currentTarget } from './current-target';
import { LAYER_LABEL, LAYER_REF } from './layer-text.constants';
import { runLayer } from './run-layer';

const addReferenceLayer = (path: string): void => {
  const target = currentTarget();
  if (!target) return;
  runLayer(target, LAYER_LABEL.reference, { name: COMMAND_NAME.layerReferenceAdd, options: { path, above: { by: 'id', id: target.layerId } }, ref: LAYER_REF });
};

export { addReferenceLayer };
