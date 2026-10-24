/* @layer renderer-app @kind logic */
import type { TargetScope } from '@bxel/document';
import { cellScope } from '../editor/cell-scope';
import type { EditorTarget } from '../editor/editor.type';
import { useSpriteStore } from '../stores/useSpriteStore';
import { broadcastGroup } from './broadcast-group';
import { checkBroadcast } from './check-broadcast';
import { currentScene } from './current-scene';

const paintScope = (target: EditorTarget): TargetScope => {
  const scene = currentScene();
  const group = scene ? broadcastGroup(scene, useSpriteStore.getState().broadcast) : [];
  if (group.length < 2) return cellScope(target);
  const check = checkBroadcast(target.sprite, target.layer.name, group);
  const at = Math.max(0, target.sprite.frames.findIndex((frame) => frame.id === target.frameId));
  return {
    sprites: check.ok.map((sprite) => sprite.id),
    layers: { by: 'names', names: [target.layer.name] },
    frames: { by: 'range', from: at, to: at },
  };
};

export { paintScope };
