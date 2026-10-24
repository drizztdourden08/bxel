/* @layer core @kind types */
import type { Sprite, Tag } from '../../model/sprite.type';

type PickedTag = {
  readonly sprite: Sprite;
  readonly tag: Tag;
};

export type { PickedTag };
