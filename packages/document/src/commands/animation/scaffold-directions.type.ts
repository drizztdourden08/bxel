/* @layer core @kind types */
import type { AnimFrame, AnimTag } from '../../model/animation.type';

type Scaffold = {
  readonly frames: readonly AnimFrame[];
  readonly tags: readonly AnimTag[];
};

export type { Scaffold };
