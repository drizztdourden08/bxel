/* @layer renderer-app @kind logic */
import { COMMAND_NAME } from '@bxel/document';
import type { MapLayerId } from '@bxel/document';
import { currentMap } from './current-map';
import { mapLayerStep } from './map-layer-steps';
import { runMap } from './run-map';
import { TILE_LABEL } from './tilemap.constants';

const renameMapLayer = (layer: MapLayerId, name: string): boolean => {
  const target = currentMap();
  return target !== null && runMap(TILE_LABEL.layerRename, [mapLayerStep(COMMAND_NAME.mapLayerUpdate, target, layer, { name })]);
};

export { renameMapLayer };
