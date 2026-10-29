/* @layer renderer-app @kind types */
interface TrackLayout {
  lefts: readonly number[];
  widths: readonly number[];
  total: number;
  pxPerMs: number;
}

export type { TrackLayout };
