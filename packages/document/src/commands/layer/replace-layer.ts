/* @layer core @kind logic */
import type { Draft } from '../../draft/draft.type';
import { updateSprite } from '../../draft/update-sprite';
import type { SpriteId } from '../../model/ids.type';
import type { Layer } from '../../model/sprite.type';

const replaceLayer = (draft: Draft, spriteId: SpriteId, layer: Layer): void => {
  updateSprite(draft, spriteId, (sprite) => ({
    ...sprite,
    layers: sprite.layers.map((item) => (item.id === layer.id ? layer : item)),
  }));
};

export { replaceLayer };
