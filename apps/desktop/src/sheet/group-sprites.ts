/* @layer renderer-app @kind logic */
import type { Sprite } from '@bxel/document';
import type { SpritesScope } from '../stores/sprite-store.type';
import type { SpriteScene } from './sheet.type';

const groupSprites = (scene: SpriteScene, scope: SpritesScope): readonly Sprite[] => {
  if (!scene.active) return [];
  if (scope === 'current' || scene.selected.length < 2) return [scene.active];
  return scene.selected;
};

export { groupSprites };
