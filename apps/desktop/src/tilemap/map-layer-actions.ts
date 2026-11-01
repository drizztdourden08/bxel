/* @layer renderer-app @kind logic */
import type { MapLayerId } from '@bxel/document';
import type { LayerActions } from '../editor/layer-actions.type';
import { NO_TREE_ACTIONS } from '../editor/no-tree-actions.constants';
import { moveOutWish } from '../editor/move-out-wish';
import { selectChildren } from '../editor/select-children';
import { activateMapLayer } from './activate-map-layer';
import { addMapLayer } from './add-map-layer';
import { currentMap } from './current-map';
import { deleteMapLayer } from './delete-map-layer';
import { duplicateMapLayer } from './duplicate-map-layer';
import { flagLabel } from './flag-label';
import { flattenMapGroup } from './flatten-map-group';
import { groupMapLayers } from './group-map-layers';
import { mergeMapLayerDown } from './merge-map-layer-down';
import { moveMapLayersTo } from './move-map-layers-to';
import { reorderMapLayer } from './reorder-map-layer';
import { setOtherMapLayers } from './set-other-map-layers';
import { soloMapLayer } from './solo-map-layer';
import { TILE_LABEL } from './tilemap.constants';
import { tryRenameMapLayer } from './try-rename-map-layer';
import { ungroupMapLayer } from './ungroup-map-layer';
import { updateMapLayers } from './update-map-layers';

const asIds = (ids: readonly string[]): MapLayerId[] => ids.map((id) => id as MapLayerId);

const mapLayerActions: LayerActions = {
  activate: activateMapLayer,
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
  ...NO_TREE_ACTIONS,
  moveTo: (wish) => void moveMapLayersTo(wish),
  group: groupMapLayers,
  ungroup: (id) => void ungroupMapLayer(id),
  flattenGroup: (id) => void flattenMapGroup(id),
  moveOut: (ids) => {
    const wish = moveOutWish(currentMap()?.tilemap.layers ?? [], ids);
    if (wish) void moveMapLayersTo(wish);
  },
  selectChildren: (id) => selectChildren(currentMap()?.tilemap.layers ?? [], id),
  setView: (ids, fields) => {
    if (fields.viewOpacity !== undefined) void updateMapLayers(asIds(ids), { opacity: fields.viewOpacity }, TILE_LABEL.layerOpacity);
  },
  remove: () => void deleteMapLayer(),
};

export { mapLayerActions };
