/* @layer core @kind types */
import type { CelId, FrameId } from '../model/ids.type';

type CloneIds = {
  readonly frames: ReadonlyMap<FrameId, FrameId>;
  readonly cels: ReadonlyMap<CelId, CelId>;
};

export type { CloneIds };
