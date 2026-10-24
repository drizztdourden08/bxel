/* @layer core @kind types */
import type { Tag } from '../model/sprite.type';

type ShrunkTags = {
  readonly tags: readonly Tag[];
  readonly removed: readonly Tag[];
};

export type { ShrunkTags };
