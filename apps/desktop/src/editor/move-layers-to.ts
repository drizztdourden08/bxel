/* @layer renderer-app @kind logic */
import { COMMAND_NAME } from '@bxel/document';
import { LAYER_LABEL } from './layer-text.constants';
import { runLayerSteps } from './run-layer-steps';
import { spriteScope } from './sprite-scope';
import { treeMovePlan } from './tree-move-plan';
import type { TreeMoveWish } from './tree-move-plan.type';

const moveLayersTo = (wish: TreeMoveWish): boolean =>
  runLayerSteps(LAYER_LABEL.move, (target) =>
    treeMovePlan(target.sprite.layers, wish).map((step) => ({
      name: COMMAND_NAME.layerReorder,
      targets: spriteScope(target),
      options: { layer: { by: 'id', id: step.id }, to: step.to, parentId: step.parentId },
    })),
  );

export { moveLayersTo };
