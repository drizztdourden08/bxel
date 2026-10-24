/* @layer renderer-app @kind logic */
import { COMMAND_NAME } from '@bxel/document';
import type { MapLayerId } from '@bxel/document';
import { currentMap } from './current-map';
import { mapLayerStep } from './map-layer-steps';
import { runMap } from './run-map';
import { TILE_LABEL } from './tilemap.constants';

const flagMapLayer = (layer: MapLayerId, flag: 'visible' | 'locked', value: boolean): boolean => {
  const target = currentMap();
  const label = flag === 'visible' ? TILE_LABEL.layerVisible : TILE_LABEL.layerLocked;
  return target !== null && runMap(label, [mapLayerStep(COMMAND_NAME.mapLayerUpdate, target, layer, { [flag]: value })]);
};

export { flagMapLayer };
