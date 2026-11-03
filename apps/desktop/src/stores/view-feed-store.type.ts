/* @layer renderer-app @kind types */
import type { PixelSource, PixelView } from '../views/PixelViewport';

interface ViewFeedState {
  view: PixelView | null;
  other: PixelView | null;
  source: PixelSource | undefined;
  frame: number;
  publish: (view: PixelView | null, source: PixelSource | undefined) => void;
  publishOther: (view: PixelView | null) => void;
}

export type { ViewFeedState };
