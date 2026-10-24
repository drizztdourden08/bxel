/* @layer renderer-app @kind logic */
import { COMMAND_NAME } from '@bxel/document';
import { currentMap } from './current-map';
import { mapLayerStep } from './map-layer-steps';
import { runMap } from './run-map';
import { TILE_LABEL } from './tilemap.constants';

const moveMapLayer = (by: 1 | -1): boolean => {
  const target = currentMap();
  if (!target) return false;
  const at = target.tilemap.layers.findIndex((each) => each.id === target.layer.id);
  const to = at + by;
  if (to < 0 || to >= target.tilemap.layers.length) return false;
  return runMap(TILE_LABEL.layerMove, [mapLayerStep(COMMAND_NAME.mapLayerReorder, target, target.layer.id, { to })]);
};

export { moveMapLayer };
