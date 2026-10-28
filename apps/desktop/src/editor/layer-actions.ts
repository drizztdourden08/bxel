/* @layer renderer-app @kind logic */
import type { LayerId } from '@bxel/document';
import { useToolStore } from '../stores/useToolStore';
import { addLayer } from './add-layer';
import { deleteLayer } from './delete-layer';
import { duplicateLayer } from './duplicate-layer';
import { flattenLayers } from './flatten-layers';
import type { LayerActions } from './layer-actions.type';
import { flagFields } from './flag-fields';
import { LAYER_LABEL } from './layer-text.constants';
import { mergeLayerDown } from './merge-layer-down';
import { moveLayer } from './move-layer';
import { tryRenameLayer } from './rename-layer';
import { updateLayers } from './update-layers';
import { setLayerColour } from './set-layer-colour';
import { setLayerLock } from './set-layer-lock';
import { setOtherLayers } from './set-other-layers';
import { soloLayer } from './solo-layer';

const asIds = (ids: readonly string[]): LayerId[] => ids.map((id) => id as LayerId);

const spriteLayerActions: LayerActions = {
  activate: (id) => useToolStore.getState().setLayer(id as LayerId),
  setFlag: (ids, flag, value) => void updateLayers(asIds(ids), flagFields(flag, value), LAYER_LABEL[flag]),
  setLock: (ids, kind) => void setLayerLock(asIds(ids), kind),
  setColour: (ids, colour) => void setLayerColour(asIds(ids), colour),
  solo: (id) => soloLayer(id),
  others: (id, flag) => setOtherLayers(id as LayerId, flag),
  rename: (id, name) => tryRenameLayer(id as LayerId, name),
  move: moveLayer,
  add: addLayer,
  duplicate: duplicateLayer,
  merge: mergeLayerDown,
  flatten: flattenLayers,
  remove: deleteLayer,
};

export { spriteLayerActions };
