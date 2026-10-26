/* @layer renderer-app @kind types */
import type { GuideDrag } from '../guides/guide.type';

interface GuideState {
  drag: GuideDrag | null;
  setDrag: (drag: GuideDrag | null) => void;
}

export type { GuideState };
