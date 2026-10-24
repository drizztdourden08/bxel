/* @layer renderer-app @kind logic */
import { COMMAND_NAME } from '@bxel/document';
import type { Sprite } from '@bxel/document';
import { commitRequest } from '../editor/commit-request';
import type { EditorTarget } from '../editor/editor.type';
import { LAYER_LABEL } from '../editor/layer-text.constants';
import { useDocumentStore } from '../stores/useDocumentStore';
import { useNoticeStore } from '../stores/useNoticeStore';
import { useSpriteStore } from '../stores/useSpriteStore';
import { currentScene } from './current-scene';
import { mismatchModel } from './mismatch-model';
import { spritesTarget } from './sprites-target';

const duplicateLayerAcross = (target: EditorTarget, group: readonly Sprite[]): void => {
  const scene = currentScene();
  if (!scene) return;
  const name = target.layer.name;
  if (mismatchModel(scene, name, group, false) !== null) {
    useSpriteStore.getState().setGap(name);
    return;
  }
  const step = { name: COMMAND_NAME.layerDuplicate, options: { layer: { by: 'name', name } } };
  const label = `${LAYER_LABEL.duplicate} on ${group.length} sprites`;
  const result = useDocumentStore.getState().host.execute(commitRequest(target, label, step, spritesTarget(group.map((sprite) => sprite.id))));
  if (!result.ok) useNoticeStore.getState().post(result.error.message);
};

export { duplicateLayerAcross };
