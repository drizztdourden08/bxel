/* @layer renderer-app @kind types */
import type { Rect, SheetId, SpriteId } from '@bxel/document';

type FrameMode = 'reference' | 'copy';

type StripBy = 'count' | 'size';

type StripResult = 'cells' | 'cut';

type AddMode = 'sprites' | 'strip' | 'sheet';

interface StripSpec {
  by: StripBy;
  columns: number;
  rows: number;
  cellWidth: number;
  cellHeight: number;
}

interface StripPlan {
  cells: readonly Rect[];
  error: string | null;
}

interface AddFramesRequest {
  at: number;
  durationMs: number;
}

interface SpritesAdd extends AddFramesRequest {
  kind: 'sprites';
  sprites: readonly SpriteId[];
  mode: FrameMode;
}

interface StripAdd extends AddFramesRequest {
  kind: 'strip';
  sprite: SpriteId;
  spec: StripSpec;
  cells: number;
  result: StripResult;
}

interface SheetAdd extends AddFramesRequest {
  kind: 'sheet';
  sheet: SheetId;
  mode: FrameMode;
}

type AddRequest = SpritesAdd | StripAdd | SheetAdd;

interface AddFramesState {
  mode: AddMode | null;
  show: (mode: AddMode) => void;
  hide: () => void;
}

export type { AddFramesState, AddRequest, FrameMode, StripPlan, StripResult, StripSpec };
