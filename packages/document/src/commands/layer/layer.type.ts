/* @layer core @kind types */
import type { CelId, LayerId, SpriteId } from '../../model/ids.type';
import type { Layer, Sprite } from '../../model/sprite.type';

type PickedLayer = {
  readonly sprite: Sprite;
  readonly layer: Layer;
  readonly index: number;
};

type CelMerge = {
  readonly spriteId: SpriteId;
  readonly sourceLayer: LayerId;
  readonly from: CelId;
  readonly into: CelId | undefined;
};

export type { CelMerge, PickedLayer };
