/* @layer renderer-app @kind logic */
import type { LayerId } from '@bxel/document';
import { useToolStore } from '../stores/useToolStore';
import { addLayer } from './add-layer';
import { deleteLayer } from './delete-layer';
import { chooseReferenceLayer } from './choose-reference-layer';
import { duplicateLayer } from './duplicate-layer';
import { flattenLayers } from './flatten-layers';
import { groupLayers } from './group-layers';
import type { LayerActions, ViewFields } from './layer-actions.type';
import { flagFields } from './flag-fields';
import { LAYER_LABEL } from './layer-text.constants';
import { mergeLayers } from './merge-layers';
import { mergeSelectedLayers } from './merge-selected-layers';
import { moveLayer } from './move-layer';
import { moveLayersTo } from './move-layers-to';
import { relinkReference } from './relink-reference';
import { selectionToLayer } from './selection-to-layer';
import { ungroupLayer } from './ungroup-layer';
import { tryRenameLayer } from './rename-layer';
import { updateLayers } from './update-layers';
import { setLayerColour } from './set-layer-colour';
import { setLayerLock } from './set-layer-lock';
import { setOtherLayers } from './set-other-layers';
import { soloLayer } from './solo-layer';

const asIds = (ids: readonly string[]): LayerId[] => ids.map((id) => id as LayerId);

const viewLabel = (fields: ViewFields): string => {
  if (fields.viewOpacity !== undefined) return LAYER_LABEL.opacity;
  return fields.clip === undefined ? LAYER_LABEL.exported : LAYER_LABEL.clip;
};

const spriteLayerActions: LayerActions = {
  activate: (id) => useToolStore.getState().setLayer(id as LayerId),
  setFlag: (ids, flag, value) => void updateLayers(asIds(ids), flagFields(flag, value), LAYER_LABEL[flag]),
  setLock: (ids, kind) => void setLayerLock(asIds(ids), kind),
  setColour: (ids, colour) => void setLayerColour(asIds(ids), colour),
  solo: (id) => soloLayer(id),
  others: (id, flag) => setOtherLayers(id as LayerId, flag),
  rename: (id, name) => tryRenameLayer(id as LayerId, name),
  move: moveLayer,
  moveTo: (wish) => void moveLayersTo(wish),
  setView: (ids, fields) => void updateLayers(asIds(ids), fields, viewLabel(fields)),
  group: groupLayers,
  ungroup: ungroupLayer,
  mergeSelected: mergeSelectedLayers,
  toLayer: selectionToLayer,
  addReference: () => void chooseReferenceLayer(),
  relink: (id) => void relinkReference(id),
  add: addLayer,
  duplicate: duplicateLayer,
  merge: mergeLayers,
  flatten: flattenLayers,
  remove: deleteLayer,
};

export { spriteLayerActions };
