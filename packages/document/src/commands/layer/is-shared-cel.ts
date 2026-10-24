/* @layer core @kind logic */
import type { CelId, LayerId } from '../../model/ids.type';
import type { Sprite } from '../../model/sprite.type';

const isSharedCel = (sprite: Sprite, celId: CelId, except: LayerId): boolean => {
  const uses = sprite.layers
    .filter((layer) => layer.id !== except)
    .flatMap((layer) => Object.values(layer.cels))
    .filter((id) => id === celId);
  return uses.length > 1;
};

export { isSharedCel };
