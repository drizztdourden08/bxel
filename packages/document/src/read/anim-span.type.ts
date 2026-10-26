/* @layer core @kind types */
import type { AnimDirection, AnimFlip } from '../model/animation.type';

type AnimSpan = {
  readonly first: number;
  readonly last: number;
  readonly direction: AnimDirection;
  readonly repeat: number;
  readonly flip: AnimFlip | null;
};

export type { AnimSpan };
