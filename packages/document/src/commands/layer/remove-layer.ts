/* @layer core @kind logic */
import type { Draft } from '../../draft/draft.type';
import { updateSprite } from '../../draft/update-sprite';
import type { SpriteId } from '../../model/ids.type';
import type { Layer } from '../../model/sprite.type';
import { dropOrphans } from './drop-orphans';

const removeLayer = (draft: Draft, spriteId: SpriteId, layer: Layer): void => {
  updateSprite(draft, spriteId, (sprite) => {
    const layers = sprite.layers.filter((item) => item.id !== layer.id);
    return { ...sprite, layers, cels: dropOrphans(sprite.cels, layer, layers) };
  });
};

export { removeLayer };
