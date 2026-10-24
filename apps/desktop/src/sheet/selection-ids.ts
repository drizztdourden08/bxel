/* @layer renderer-app @kind logic */
import type { SpriteId } from '@bxel/document';
import type { SpriteScene } from './sheet.type';

const selectionIds = (scene: SpriteScene): SpriteId[] => {
  if (scene.selected.length > 0) return scene.selected.map((sprite) => sprite.id);
  return scene.active ? [scene.active.id] : [];
};

export { selectionIds };
