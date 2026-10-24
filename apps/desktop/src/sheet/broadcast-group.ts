/* @layer renderer-app @kind logic */
import type { Sprite } from '@bxel/document';
import type { SpriteScene } from './sheet.type';

const broadcastGroup = (scene: SpriteScene, on: boolean): readonly Sprite[] => {
  const { active, selected } = scene;
  if (!on || !active || selected.length < 2) return [];
  return selected.some((sprite) => sprite.id === active.id) ? selected : [];
};

export { broadcastGroup };
