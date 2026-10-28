/* @layer renderer-app @kind logic */
import type { LayerId } from '@bxel/document';
import type { LayerFields } from './layer-lock.type';
import { layerUpdateSteps } from './layer-update-steps';
import { runLayerSteps } from './run-layer-steps';

const updateLayers = (ids: readonly LayerId[], fields: LayerFields, label: string): boolean =>
  runLayerSteps(label, (target) => layerUpdateSteps(target, ids, fields));

export { updateLayers };
