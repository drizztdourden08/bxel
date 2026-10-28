/* @layer renderer-app @kind logic */
import type { CommandError, LayerId } from '@bxel/document';
import { currentTarget } from './current-target';
import type { LayerFields } from './layer-lock.type';
import { layerUpdateSteps } from './layer-update-steps';
import { executeLayerSteps, runLayerSteps } from './run-layer-steps';

/** Changes the given layers in one undo step. Returns the refusal, or null when it worked. */
const runLayerUpdate = (ids: readonly LayerId[], fields: LayerFields, label: string): CommandError | null => {
  const target = currentTarget();
  return target ? executeLayerSteps(target, label, layerUpdateSteps(target, ids, fields)) : null;
};

/** The same, and a refusal shows as a notice. */
const updateLayers = (ids: readonly LayerId[], fields: LayerFields, label: string): boolean =>
  runLayerSteps(label, (target) => layerUpdateSteps(target, ids, fields));

export { runLayerUpdate, updateLayers };
