/* @layer renderer-app @kind types */
import type { PointerEvent, RefObject } from 'react';
import type { Point, Sprite, SpriteId } from '@bxel/document';
import type { SceneModel, SheetItem, SheetModel } from '../../sheet/sheet.type';

type SheetDrag =
  | { kind: 'move'; ids: readonly SpriteId[]; start: Point; delta: Point; pending: SpriteId | null }
  | { kind: 'slice'; sprite: Sprite; origin: Point; start: Point; end: Point };

interface SheetMarks {
  labels: boolean;
  overlaps: boolean;
  pivots: boolean;
}

interface SnapSheetInput {
  items: readonly SheetItem[];
  drag: Extract<SheetDrag, { kind: 'move' }>;
  delta: Point;
  invert: boolean;
  zoom: number;
}

interface SheetPaintBase {
  model: SheetModel;
  marks: SheetMarks;
  selected: ReadonlySet<SpriteId>;
  active: SpriteId | null;
}

interface SheetPaintState extends SheetPaintBase {
  drag: SheetDrag | null;
}

interface SheetLook {
  frame: string;
  selected: string;
  active: string;
  overlap: string;
  slice: string;
  pivot: string;
  label: string;
}

interface SheetGesture {
  down: (event: PointerEvent<HTMLElement>) => void;
  move: (event: PointerEvent<HTMLElement>) => void;
  up: () => void;
}

interface SheetView {
  data: SceneModel;
  model: SheetModel;
  image: ImageData;
}

interface DownInput {
  event: PointerEvent<HTMLElement>;
  at: Point;
  items: readonly SheetItem[];
  drag: RefObject<SheetDrag | null>;
  memo: RefObject<ClickMemo>;
}

interface SheetSurfaceProps {
  sheet: SheetView;
}

interface PressInput {
  event: PointerEvent<HTMLElement>;
  id: SpriteId;
  at: Point;
}

interface StartMoveInput {
  id: SpriteId;
  at: Point;
  collapse: boolean;
}

interface ClickMemo {
  id: SpriteId | null;
  at: number;
}

export type { ClickMemo, DownInput, PressInput, StartMoveInput, SheetDrag, SheetGesture, SheetLook, SheetPaintBase, SnapSheetInput, SheetPaintState, SheetSurfaceProps, SheetView };
