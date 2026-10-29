/* @layer renderer-app @kind types */
import type { Rect, SpriteId } from '@bxel/document';
import type { IslandRequest, SliceGrid, SliceRequest } from '@bxel/raster';
import type { FrameMode, StripResult, StripSpec } from '../add-frames/add-frames.type';

type SliceBy = 'count' | 'size' | 'islands';

type SliceExistingRule = 'replace' | 'keep' | 'skip';

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
  swap: boolean;
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
  minSize: number;
  merge: number;
  pattern: string;
  start: number;
  keep: boolean;
  existing: SliceExistingRule;
  skipEmpty: boolean;
}

type SliceOptions = SliceRequest & {
  islands?: IslandRequest;
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
  clashes: readonly SpriteId[];
  grid: SliceGrid | null;
  leftOut: number;
  rects: readonly Rect[];
}

export type { SliceExistingRule, AnimatePlan, AnimateSpec, CutStripSpec, PiecePlan, SliceOptions, SlicePlan, SliceSpec, SplitSpec };
