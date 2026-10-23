/* @layer core @kind logic */
import type { LayerId } from '../model/ids.type';
import type { Layer, Sprite } from '../model/sprite.type';

const findLayer = (sprite: Sprite, id: LayerId): Layer | undefined =>
  sprite.layers.find((layer) => layer.id === id);

export { findLayer };
