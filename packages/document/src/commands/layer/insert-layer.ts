/* @layer core @kind logic */
import type { Draft } from '../../draft/draft.type';
import { updateSprite } from '../../draft/update-sprite';
import type { SpriteId } from '../../model/ids.type';
import type { Layer } from '../../model/sprite.type';

const insertLayer = (draft: Draft, spriteId: SpriteId, layer: Layer, at: number): void => {
  updateSprite(draft, spriteId, (sprite) => ({
    ...sprite,
    layers: [...sprite.layers.slice(0, at), layer, ...sprite.layers.slice(at)],
  }));
};

export { insertLayer };
