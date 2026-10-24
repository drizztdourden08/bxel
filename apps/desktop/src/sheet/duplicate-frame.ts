/* @layer renderer-app @kind logic */
import { COMMAND_NAME } from '@bxel/document';
import { currentTarget } from '../editor/current-target';
import { useSpriteStore } from '../stores/useSpriteStore';
import { currentScene } from './current-scene';
import { groupSprites } from './group-sprites';
import { runDocument } from './run-document';
import { SPRITE_LABEL } from './sprite-label.constants';
import { spritesTarget } from './sprites-target';

const duplicateFrame = (): void => {
  const target = currentTarget();
  const scene = currentScene();
  if (!target || !scene) return;
  const group = groupSprites(scene, useSpriteStore.getState().spritesScope);
  const at = Math.max(0, target.sprite.frames.findIndex((frame) => frame.id === target.frameId));
  const step = { name: COMMAND_NAME.frameDuplicate, targets: spritesTarget(group.map((sprite) => sprite.id)), options: { frame: { by: 'index', index: at } } };
  runDocument(SPRITE_LABEL.frame(group.length), [step]);
};

export { duplicateFrame };
