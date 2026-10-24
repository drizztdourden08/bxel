/* @layer renderer-app @kind logic */
import { COMMAND_NAME } from '@bxel/document';
import { currentScene } from '../sheet/current-scene';
import { duplicateLayerAcross } from '../sheet/duplicate-layer-across';
import { groupSprites } from '../sheet/group-sprites';
import { useSpriteStore } from '../stores/useSpriteStore';
import { currentTarget } from './current-target';
import { LAYER_LABEL, LAYER_REF } from './layer-text.constants';
import { runLayer } from './run-layer';
import { selectCreated } from './select-created';

const duplicateLayer = (): void => {
  const target = currentTarget();
  const scene = currentScene();
  if (!target) return;
  const group = scene ? groupSprites(scene, useSpriteStore.getState().spritesScope) : [];
  if (group.length > 1) {
    duplicateLayerAcross(target, group);
    return;
  }
  const options = { layer: { by: 'id', id: target.layerId } };
  const done = runLayer(target, LAYER_LABEL.duplicate, { name: COMMAND_NAME.layerDuplicate, options, ref: LAYER_REF });
  if (done) selectCreated(done);
};

export { duplicateLayer };
