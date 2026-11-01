/* @layer renderer-app @kind logic */
import { COMMAND_NAME } from '@bxel/document';
import type { MapLayerId } from '@bxel/document';
import { currentMap } from './current-map';
import { mapLayerStep } from './map-layer-steps';
import { runMap } from './run-map';
import { TILE_LABEL } from './tilemap.constants';

const ungroupMapLayer = (id: string): boolean => {
  const target = currentMap();
  return target !== null && runMap(TILE_LABEL.layerUngroup, [mapLayerStep(COMMAND_NAME.mapLayerUngroup, target, id as MapLayerId, {})]);
};

export { ungroupMapLayer };
