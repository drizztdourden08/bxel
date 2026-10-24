/* @layer core @kind types */
import type { SpriteId } from '../model/ids.type';
import type { Sprite } from '../model/sprite.type';

type SpriteSwap = {
  readonly sources: readonly SpriteId[];
  readonly made: readonly Sprite[];
  readonly keep: boolean;
};

export type { SpriteSwap };
