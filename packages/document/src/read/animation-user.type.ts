/* @layer core @kind types */
import type { AnimationId } from '../model/ids.type';

type AnimationUser = {
  readonly animationId: AnimationId;
  readonly name: string;
  readonly frames: number;
};

export type { AnimationUser };
