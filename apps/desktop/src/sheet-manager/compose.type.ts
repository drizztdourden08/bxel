/* @layer renderer-app @kind types */
import type { SliceGrid, SliceRequest } from '@bxel/raster';
import type { FrameMode, StripResult, StripSpec } from '../add-frames/add-frames.type';

type SliceBy = 'count' | 'size';

interface AnimateSpec {
  name: string;
  mode: FrameMode;
  durationMs: number;
}

interface AnimatePlan {
  width: number;
  height: number;
  frames: number;
  mixed: boolean;
  name: string;
  blocker: string | null;
}

interface CutStripSpec {
  name: string;
  strip: StripSpec;
  result: StripResult;
  durationMs: number;
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

export type { AnimatePlan, AnimateSpec, CutStripSpec, PiecePlan, SliceOptions, SlicePlan, SliceSpec, SplitSpec };
