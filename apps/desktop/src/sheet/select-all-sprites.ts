/* @layer renderer-app @kind logic */
import { busy } from './busy';
import { chooseSprites } from './choose-sprites';
import { currentScene } from './current-scene';

const selectAllSprites = (): void => {
  const scene = currentScene();
  if (!scene || busy()) return;
  const ids = scene.sprites.map((sprite) => sprite.id);
  chooseSprites({ selected: ids, anchor: ids[0] ?? null, active: scene.active?.id ?? ids[0] ?? null });
};

export { selectAllSprites };
