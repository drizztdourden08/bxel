/* @layer renderer-app @kind logic */
import type { EditorTarget } from '../editor/editor.type';
import { useSpriteStore } from '../stores/useSpriteStore';
import { broadcastGroup } from './broadcast-group';
import { checkBroadcast } from './check-broadcast';
import { currentScene } from './current-scene';
import { MISMATCH_TEXT } from './sheet.constants';

const broadcastBlock = (target: EditorTarget): string | null => {
  const scene = currentScene();
  const group = scene ? broadcastGroup(scene, useSpriteStore.getState().broadcast) : [];
  if (group.length < 2) return null;
  return checkBroadcast(target.sprite, target.layer.name, group).gaps.length > 0 ? MISMATCH_TEXT.paintBlocked : null;
};

export { broadcastBlock };
