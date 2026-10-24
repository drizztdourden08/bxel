/* @layer renderer-app @kind logic */
import { COMMAND_NAME } from '@bxel/document';
import type { SpriteId } from '@bxel/document';
import { chooseSprites } from './choose-sprites';
import { currentScene } from './current-scene';
import { runDocument } from './run-document';
import { SPRITE_LABEL } from './sprite-label.constants';
import { spritesTarget } from './sprites-target';

const deleteSprites = (ids: readonly SpriteId[]): void => {
  const scene = currentScene();
  if (!scene || ids.length === 0) return;
  const gone = new Set(ids);
  const first = scene.sprites.findIndex((sprite) => gone.has(sprite.id));
  const remaining = scene.sprites.filter((sprite) => !gone.has(sprite.id));
  const step = { name: COMMAND_NAME.spriteDelete, targets: spritesTarget(ids), options: {} };
  if (runDocument(SPRITE_LABEL.remove(ids.length), [step]) === null) return;
  const next = remaining[Math.min(first, remaining.length - 1)];
  if (next) chooseSprites({ selected: [next.id], anchor: next.id, active: next.id });
};

export { deleteSprites };
