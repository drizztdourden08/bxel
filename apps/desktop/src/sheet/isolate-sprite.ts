/* @layer renderer-app @kind logic */
import type { SpriteId } from '@bxel/document';
import { useSpriteStore } from '../stores/useSpriteStore';
import { busy } from './busy';
import { chooseSprites } from './choose-sprites';
import { currentScene } from './current-scene';

const isolateSprite = (id?: SpriteId): void => {
  const scene = currentScene();
  if (!scene || busy()) return;
  const wanted = id ?? scene.active?.id ?? scene.selected[0]?.id;
  if (wanted === undefined) return;
  chooseSprites({ selected: [wanted], anchor: wanted, active: wanted });
  useSpriteStore.getState().setMode('sprite', true);
};

export { isolateSprite };
