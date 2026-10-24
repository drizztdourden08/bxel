/* @layer renderer-app @kind logic */
import { COMMAND_NAME } from '@bxel/document';
import { currentMap } from './current-map';
import { mapLayerStep } from './map-layer-steps';
import { runMap } from './run-map';
import { TILE_LABEL } from './tilemap.constants';

const deleteMapLayer = (): boolean => {
  const target = currentMap();
  return target !== null && runMap(TILE_LABEL.layerDelete, [mapLayerStep(COMMAND_NAME.mapLayerDelete, target, target.layer.id, {})]);
};

export { deleteMapLayer };
