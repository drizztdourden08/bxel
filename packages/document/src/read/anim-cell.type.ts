/* @layer core @kind types */
import type { AnimFlip } from '../model/animation.type';
import type { AnimFrameId } from '../model/ids.type';

type AnimCell = {
  readonly frameId: AnimFrameId;
  readonly flip: AnimFlip | null;
};

export type { AnimCell };
