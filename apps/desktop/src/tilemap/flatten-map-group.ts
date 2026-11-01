/* @layer renderer-app @kind logic */
import { COMMAND_NAME } from '@bxel/document';
import type { MapLayerId } from '@bxel/document';
import { flattenGroupPlan } from '../editor/flatten-group-plan';
import { useTilemapStore } from '../stores/useTilemapStore';
import { currentMap } from './current-map';
import { mapLayerStep } from './map-layer-steps';
import { runMap } from './run-map';
import { TILE_LABEL } from './tilemap.constants';

const flattenMapGroup = (id: string): boolean => {
  const target = currentMap();
  const plan = target ? flattenGroupPlan(target.tilemap.layers, id) : null;
  if (!target || !plan) return false;
  const steps = plan.steps.map((step) =>
    mapLayerStep(step.op === 'merge' ? COMMAND_NAME.mapLayerMerge : COMMAND_NAME.mapLayerUngroup, target, step.id as MapLayerId, {}),
  );
  const done = runMap(TILE_LABEL.layerFlattenGroup, steps);
  if (done && plan.keep !== null) useTilemapStore.getState().setLayer(plan.keep as MapLayerId);
  return done;
};

export { flattenMapGroup };
