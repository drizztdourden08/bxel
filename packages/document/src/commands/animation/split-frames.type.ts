/* @layer core @kind types */
import type { AnimFrame } from '../../model/animation.type';
import type { SpriteId } from '../../model/ids.type';

type SplitResult = {
  readonly frames: readonly AnimFrame[];
  readonly promoted: ReadonlySet<SpriteId>;
  readonly made: number;
};

export type { SplitResult };
