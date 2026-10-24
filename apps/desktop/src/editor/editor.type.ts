/* @layer renderer-app @kind types */
import type { Brush, Connectivity, FillMode, MaskView, Point, Rect, ShapeKind, Symmetry } from '@bxel/raster';
import type { DocumentId, FrameId, Layer, LayerId, PaletteBank, Sprite } from '@bxel/document';
import type { ToolSettings } from '../stores/tool-store.type';
import type { StrokeTool } from './tool.type';

interface EditorTarget {
  documentId: DocumentId;
  revision: number;
  sprite: Sprite;
  bank: PaletteBank;
  layer: Layer;
  layerId: LayerId;
  frameId: FrameId;
}

interface BrushOptions {
  brush: Brush;
  pixelPerfect: boolean;
  symmetry: Symmetry;
}

interface Overlay {
  width: number;
  height: number;
  base: Uint8Array;
  indices: Uint8Array;
  rgba: Uint8ClampedArray<ArrayBuffer>;
  table: Uint8ClampedArray<ArrayBuffer>;
  dirty: Rect | null;
  mask: MaskView | null;
}

interface StrokeSession extends Overlay {
  kind: 'stroke';
  tool: StrokeTool;
  index: number;
  options: BrushOptions;
  points: Point[];
}

interface ShapeSpec {
  shape: ShapeKind;
  filled: boolean;
  index: number;
  brush: Brush;
  symmetry: Symmetry;
  from: Point;
  to: Point;
}

interface ShapeSession extends Overlay {
  kind: 'shape';
  spec: ShapeSpec;
}

type PaintSession = StrokeSession | ShapeSession;

interface StrokeStart {
  target: EditorTarget;
  tool: StrokeTool;
  index: number;
  options: BrushOptions;
  at: Point;
}

interface ShapeStart {
  target: EditorTarget;
  spec: ShapeSpec;
}

interface FillChoice {
  index: number;
  mode: FillMode;
  connectivity: Connectivity;
}

type SymmetryFields = Pick<ToolSettings, 'symmetryX' | 'symmetryY' | 'axisX' | 'axisY'>;

type ZoomStep = 'in' | 'out' | 'fit' | 'actual';

type HistoryDirection = 'undo' | 'redo';

export type {
  BrushOptions, EditorTarget, FillChoice, HistoryDirection, Overlay, PaintSession, ShapeSession, ShapeSpec, ShapeStart, StrokeSession, StrokeStart,
  SymmetryFields, ZoomStep,
};
