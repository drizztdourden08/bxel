/* @layer renderer-app @kind logic */
import { COMMAND_NAME } from '@bxel/document';
import type { LayerId } from '@bxel/document';
import { useToolStore } from '../stores/useToolStore';
import { currentTarget } from './current-target';
import { flattenGroupPlan } from './flatten-group-plan';
import { LAYER_LABEL } from './layer-text.constants';
import { runLayerSteps } from './run-layer-steps';
import { spriteScope } from './sprite-scope';

const flattenGroup = (id: string): void => {
  const plan = flattenGroupPlan(currentTarget()?.sprite.layers ?? [], id);
  if (!plan) return;
  const done = runLayerSteps(LAYER_LABEL.flattenGroup, (now) =>
    plan.steps.map((step) => ({
      name: step.op === 'merge' ? COMMAND_NAME.layerMerge : COMMAND_NAME.layerUngroup,
      targets: spriteScope(now),
      options: { layer: { by: 'id', id: step.id } },
    })),
  );
  if (done && plan.keep !== null) useToolStore.getState().setLayer(plan.keep as LayerId);
};

export { flattenGroup };
