/* @layer renderer-app @kind logic */
import { COMMAND_NAME } from '@bxel/document';
import type { MapLayerId } from '@bxel/document';
import { treeMovePlan } from '../editor/tree-move-plan';
import type { TreeMoveWish } from '../editor/tree-move-plan.type';
import { currentMap } from './current-map';
import { mapLayerStep } from './map-layer-steps';
import { runMap } from './run-map';
import { TILE_LABEL } from './tilemap.constants';

const moveMapLayersTo = (wish: TreeMoveWish): boolean => {
  const target = currentMap();
  if (!target) return false;
  const steps = treeMovePlan(target.tilemap.layers, wish).map((step) =>
    mapLayerStep(COMMAND_NAME.mapLayerReorder, target, step.id as MapLayerId, { to: step.to, parentId: step.parentId }),
  );
  return runMap(TILE_LABEL.layerMove, steps);
};

export { moveMapLayersTo };
