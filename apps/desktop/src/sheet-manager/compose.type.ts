/* @layer renderer-app @kind types */
import type { SliceGrid, SliceRequest } from '@bxel/raster';
import type { Anchor } from '@drizztdourden08/tessera';

type SliceBy = 'count' | 'size';

interface MergeSpec {
  name: string;
  anchor: Anchor;
  keep: boolean;
}

interface MergePlan {
  width: number;
  height: number;
  frames: number;
  mixed: boolean;
  blocker: string | null;
}

interface SplitSpec {
  pattern: string;
  start: number;
  keep: boolean;
}

interface SliceSpec {
  by: SliceBy;
  columns: number;
  rows: number;
  cellWidth: number;
  cellHeight: number;
  pattern: string;
  start: number;
  keep: boolean;
  skipEmpty: boolean;
}

type SliceOptions = SliceRequest & {
  pattern: string;
  start: number;
  keep: boolean;
  skipEmpty: boolean;
};

interface PiecePlan {
  names: readonly string[];
  error: string | null;
}

interface SlicePlan extends PiecePlan {
  grid: SliceGrid | null;
  leftOut: number;
}

export type { MergePlan, MergeSpec, PiecePlan, SliceOptions, SlicePlan, SliceSpec, SplitSpec };
