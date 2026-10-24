/* @layer renderer-app @kind logic */
import { useNoticeStore } from '../stores/useNoticeStore';
import { useSpriteStore } from '../stores/useSpriteStore';
import { currentScene } from './current-scene';
import { SHEET_TEXT } from './sheet.constants';

const toggleBroadcast = (): void => {
  const scene = currentScene();
  const sprites = useSpriteStore.getState();
  if (!scene) return;
  if (!sprites.broadcast && scene.selected.length < 2) {
    useNoticeStore.getState().post(SHEET_TEXT.paintNeedsTwo);
    return;
  }
  sprites.setBroadcast(!sprites.broadcast);
};

export { toggleBroadcast };
