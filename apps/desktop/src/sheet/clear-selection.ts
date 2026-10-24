/* @layer renderer-app @kind logic */
import { busy } from './busy';
import { chooseSprites } from './choose-sprites';
import { currentScene } from './current-scene';

const clearSpriteSelection = (): void => {
  const scene = currentScene();
  if (!scene || busy()) return;
  chooseSprites({ selected: [], anchor: null, active: scene.active?.id ?? null });
};

export { clearSpriteSelection };
