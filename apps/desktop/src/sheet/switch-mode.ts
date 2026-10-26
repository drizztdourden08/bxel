/* @layer renderer-app @kind logic */
import { settleMapTool } from '../tilemap/settle-map-tool';
import type { SpriteMode } from '../stores/sprite-store.type';
import { useSpriteStore } from '../stores/useSpriteStore';
import { busy } from './busy';
import { currentScene } from './current-scene';

const switchMode = (mode: SpriteMode): boolean => {
  const sprites = useSpriteStore.getState();
  const scene = currentScene();
  if (!scene || sprites.mode === mode) return scene !== null;
  if (busy()) return false;
  sprites.setMode(mode, false);
  if (mode === 'tilemap') settleMapTool();
  if (mode === 'sheet' && scene.selected.length === 0 && scene.active) sprites.setSelection([scene.active.id], scene.active.id);
  return true;
};

export { switchMode };
