/* @layer core @kind types */
import type { AnimFrame } from '../../model/animation.type';
import type { BankId } from '../../model/ids.type';

type AnimationPlan = {
  readonly width: number;
  readonly height: number;
  readonly bankId: BankId;
  readonly frames: readonly AnimFrame[];
};

export type { AnimationPlan };
