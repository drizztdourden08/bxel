/* @layer renderer-app @kind logic */
import type { MapLayerId } from '@bxel/document';
import type { LayerActions } from '../editor/layer-actions.type';
import { useTilemapStore } from '../stores/useTilemapStore';
import { addMapLayer } from './add-map-layer';
import { deleteMapLayer } from './delete-map-layer';
import { duplicateMapLayer } from './duplicate-map-layer';
import { flagLabel } from './flag-label';
import { mergeMapLayerDown } from './merge-map-layer-down';
import { reorderMapLayer } from './reorder-map-layer';
import { setOtherMapLayers } from './set-other-map-layers';
import { soloMapLayer } from './solo-map-layer';
import { TILE_LABEL } from './tilemap.constants';
import { tryRenameMapLayer } from './try-rename-map-layer';
import { updateMapLayers } from './update-map-layers';

const asIds = (ids: readonly string[]): MapLayerId[] => ids.map((id) => id as MapLayerId);

const mapLayerActions: LayerActions = {
  activate: (id) => useTilemapStore.getState().setLayer(id as MapLayerId),
  setFlag: (ids, flag, value) => void updateMapLayers(asIds(ids), { [flag]: value }, flagLabel(flag)),
  setLock: (ids, kind) => void updateMapLayers(asIds(ids), { locked: kind !== 'none' }, TILE_LABEL.layerLocked),
  setColour: (ids, colour) => void updateMapLayers(asIds(ids), { colour }, TILE_LABEL.layerColour),
  solo: (id) => soloMapLayer(id),
  others: (id, flag) => setOtherMapLayers(id, flag),
  rename: (id, name) => tryRenameMapLayer(id as MapLayerId, name, TILE_LABEL.layerRename),
  move: (from, to) => void reorderMapLayer(from, to),
  add: () => void addMapLayer(),
  duplicate: () => void duplicateMapLayer(),
  merge: () => void mergeMapLayerDown(),
  flatten: () => undefined,
  remove: () => void deleteMapLayer(),
};

export { mapLayerActions };
