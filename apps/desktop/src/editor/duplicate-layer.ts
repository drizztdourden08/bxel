/* @layer renderer-app @kind logic */
import { COMMAND_NAME } from '@bxel/document';
import { currentTarget } from './current-target';
import { LAYER_LABEL, LAYER_REF } from './layer-text.constants';
import { runLayer } from './run-layer';
import { selectCreated } from './select-created';

const duplicateLayer = (): void => {
  const target = currentTarget();
  if (!target) return;
  const options = { layer: { by: 'id', id: target.layerId } };
  const done = runLayer(target, LAYER_LABEL.duplicate, { name: COMMAND_NAME.layerDuplicate, options, ref: LAYER_REF });
  if (done) selectCreated(done);
};

export { duplicateLayer };
