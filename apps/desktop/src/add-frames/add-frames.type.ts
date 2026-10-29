/* @layer renderer-app @kind types */
import type { Rect, SheetId, SpriteId } from '@bxel/document';
import type { StripFile } from './image-drop.type';

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

interface StripSource {
  name: string;
  width: number;
  height: number;
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
  sprite: SpriteId | { ref: string };
  spec: StripSpec;
  cells: number;
  result: StripResult;
}

interface SheetAdd extends AddFramesRequest {
  kind: 'sheet';
  sheet: SheetId;
  mode: FrameMode;
}

interface ImagesAdd extends AddFramesRequest {
  kind: 'images';
  frames: readonly Uint8Array[];
}

interface FileStripAdd extends AddFramesRequest {
  kind: 'file';
  file: StripFile;
  spec: StripSpec;
  cells: number;
  result: StripResult;
}

type AddRequest = SpritesAdd | StripAdd | SheetAdd | ImagesAdd | FileStripAdd;

interface AddFramesState {
  mode: AddMode | null;
  file: StripFile | null;
  show: (mode: AddMode, file?: StripFile) => void;
  hide: () => void;
}

export type { AddFramesState, AddRequest, FrameMode, StripPlan, StripResult, StripSource, StripSpec };
