/* @layer renderer-app @kind logic */
import { COMMAND_NAME } from '@bxel/document';
import { selectedLayerIds } from '../editor/layer-selection';
import { currentMap } from './current-map';
import { mapLayerStep } from './map-layer-steps';
import { runMap } from './run-map';
import { TILE_LABEL } from './tilemap.constants';

const deleteMapLayer = (): boolean => {
  const target = currentMap();
  if (!target) return false;
  const ids = selectedLayerIds(target.tilemap.layers, target.layer.id);
  const label = ids.length > 1 ? TILE_LABEL.layerDeleteMany : TILE_LABEL.layerDelete;
  return runMap(label, ids.map((id) => mapLayerStep(COMMAND_NAME.mapLayerDelete, target, id, {})));
};

export { deleteMapLayer };
