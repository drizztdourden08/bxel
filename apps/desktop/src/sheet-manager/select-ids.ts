/* @layer renderer-app @kind logic */
import type { SpriteId } from '@bxel/document';
import { busy } from '../sheet/busy';
import { chooseSprites } from '../sheet/choose-sprites';
import { currentScene } from '../sheet/current-scene';

const selectIds = (ids: readonly SpriteId[]): void => {
  const scene = currentScene();
  if (!scene || busy()) return;
  const current = scene.active?.id ?? null;
  const active = current !== null && ids.includes(current) ? current : (ids[0] ?? current);
  chooseSprites({ selected: ids, anchor: ids[0] ?? null, active });
};

export { selectIds };
