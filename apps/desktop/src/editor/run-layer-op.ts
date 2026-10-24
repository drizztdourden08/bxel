/* @layer renderer-app @kind logic */
import { addLayer } from './add-layer';
import type { LayerOp } from './layer-op.type';
import { mergeLayerDown } from './merge-layer-down';
import { stepLayer } from './step-layer';

const runLayerOp = (op: LayerOp): void => {
  if (op === 'add') addLayer();
  else if (op === 'merge') mergeLayerDown();
  else stepLayer(op === 'up' ? 1 : -1);
};

export { runLayerOp };
