/* @layer renderer-app @kind logic */
import type { SpriteId } from '@bxel/document';
import { useSpriteStore } from '../stores/useSpriteStore';
import { busy } from './busy';
import { chooseSprites } from './choose-sprites';
import { currentScene } from './current-scene';
import type { PickHow } from './sheet.type';
import { pickSprite } from './pick-sprite';

const pickSpriteById = (id: SpriteId, how: PickHow): void => {
  const scene = currentScene();
  if (!scene || busy()) return;
  const { anchor } = useSpriteStore.getState();
  chooseSprites(
    pickSprite({
      order: scene.sprites.map((sprite) => sprite.id),
      selected: scene.selected.map((sprite) => sprite.id),
      anchor,
      active: scene.active?.id ?? null,
      id,
      how,
    }),
  );
};

export { pickSpriteById };
