/* @layer renderer-app @kind logic */
import { COMMAND_NAME, layerKindOf } from '@bxel/document';
import { useToolStore } from '../stores/useToolStore';
import { LAYER_LABEL } from './layer-text.constants';
import { runLayerSteps } from './run-layer-steps';
import { currentTarget } from './current-target';
import { spriteScope } from './sprite-scope';
import { treeMovePlan } from './tree-move-plan';

const mergeSelectedLayers = (ids: readonly string[]): void => {
  const target = currentTarget();
  if (!target) return;
  const { layers } = target.sprite;
  const picked = layers.filter((layer) => ids.includes(layer.id) && layerKindOf(layer) === 'pixel');
  const [bottom, ...above] = picked;
  if (!bottom || above.length === 0) return;
  const siblings = layers.filter((layer) => (layer.parentId ?? null) === (bottom.parentId ?? null) && !above.includes(layer)).map((layer) => layer.id).reverse();
  const index = siblings.indexOf(bottom.id);
  const done = runLayerSteps(LAYER_LABEL.mergeSelected, (now) => [
    ...treeMovePlan(layers, { keys: above.map((layer) => layer.id), parentKey: bottom.parentId ?? null, index }).map((step) => ({
      name: COMMAND_NAME.layerReorder,
      targets: spriteScope(now),
      options: { layer: { by: 'id', id: step.id }, to: step.to, parentId: step.parentId },
    })),
    ...above.map((layer) => ({ name: COMMAND_NAME.layerMerge, targets: spriteScope(now), options: { layer: { by: 'id', id: layer.id } } })),
  ]);
  if (done) useToolStore.getState().setLayer(bottom.id);
};

export { mergeSelectedLayers };
