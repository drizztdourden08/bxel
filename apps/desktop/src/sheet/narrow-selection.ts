/* @layer renderer-app @kind logic */
import type { SpriteId } from '@bxel/document';
import { chooseSprites } from './choose-sprites';
import { currentScene } from './current-scene';

const narrowSelection = (keep: readonly SpriteId[]): void => {
  const scene = currentScene();
  if (!scene) return;
  const active = scene.active?.id;
  chooseSprites({ selected: keep, anchor: keep[0] ?? null, active: active !== undefined && keep.includes(active) ? active : (keep[0] ?? null) });
};

export { narrowSelection };
