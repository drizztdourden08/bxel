/* @layer renderer-app @kind logic */
import { COMMAND_NAME } from '@bxel/document';
import { currentMap } from './current-map';
import { mapLayerStep } from './map-layer-steps';
import { runMap } from './run-map';
import { TILE_LABEL } from './tilemap.constants';

const reorderMapLayer = (from: number, to: number): boolean => {
  const target = currentMap();
  const { layers = [] } = target?.tilemap ?? {};
  const moved = layers[layers.length - 1 - from];
  if (!target || !moved || from === to) return false;
  return runMap(TILE_LABEL.layerMove, [mapLayerStep(COMMAND_NAME.mapLayerReorder, target, moved.id, { to: layers.length - 1 - to })]);
};

export { reorderMapLayer };
