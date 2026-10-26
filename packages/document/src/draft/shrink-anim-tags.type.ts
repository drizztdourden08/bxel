/* @layer core @kind types */
import type { AnimTag } from '../model/animation.type';
import type { TagId } from '../model/ids.type';

type ShrunkAnimTags = {
  readonly tags: readonly AnimTag[];
  readonly removed: readonly TagId[];
};

export type { ShrunkAnimTags };
