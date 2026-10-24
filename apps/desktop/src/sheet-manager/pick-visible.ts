/* @layer renderer-app @kind logic */
import type { SpriteId } from '@bxel/document';
import { busy } from '../sheet/busy';
import { chooseSprites } from '../sheet/choose-sprites';
import { currentScene } from '../sheet/current-scene';
import { pickSprite } from '../sheet/pick-sprite';
import type { PickHow } from '../sheet/sheet.type';
import { useSpriteStore } from '../stores/useSpriteStore';

const pickVisible = (order: readonly SpriteId[], id: SpriteId, how: PickHow): void => {
  const scene = currentScene();
  if (!scene || busy()) return;
  const { anchor } = useSpriteStore.getState();
  chooseSprites(
    pickSprite({
      order,
      selected: scene.selected.map((sprite) => sprite.id),
      anchor,
      active: scene.active?.id ?? null,
      id,
      how,
    }),
  );
};

export { pickVisible };
