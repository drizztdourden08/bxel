/* @layer renderer-app @kind logic */
import type { CommandError, LayerId } from '@bxel/document';
import { currentTarget } from './current-target';
import { executeLayerSteps } from './execute-layer-steps';
import type { LayerFields } from './layer-lock.type';
import { layerUpdateSteps } from './layer-update-steps';

const runLayerUpdate = (ids: readonly LayerId[], fields: LayerFields, label: string): CommandError | null => {
  const target = currentTarget();
  return target ? executeLayerSteps(target, label, layerUpdateSteps(target, ids, fields)) : null;
};

export { runLayerUpdate };
