/* @layer renderer-app @kind logic */
import { COMMAND_NAME } from '@bxel/document';
import { currentTarget } from './current-target';
import { LAYER_LABEL, LAYER_REF } from './layer-text.constants';
import { runLayer } from './run-layer';
import { selectCreated } from './select-created';

const addLayer = (): void => {
  const target = currentTarget();
  if (!target) return;
  const options = { above: { by: 'id', id: target.layerId } };
  const done = runLayer(target, LAYER_LABEL.add, { name: COMMAND_NAME.layerAdd, options, ref: LAYER_REF });
  if (done) selectCreated(done);
};

export { addLayer };
