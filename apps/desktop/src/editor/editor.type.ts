/* @layer renderer-app @kind types */
import type {
  Brush, BufferView, Connectivity, Corners, FillMode, GradientKind, GradientPattern, Ink, InkRule, MaskView, PerfectTrail, Point, Rect, ShapeKind, Symmetry, Wrap,
} from '@bxel/raster';
import type { AnimFrame, Animation, DocumentId, FrameId, Layer, LayerId, PaletteBank, Sprite } from '@bxel/document';
import type { ToolSettings } from '../stores/tool-store.type';
import type { PathTool, StrokeTool } from './tool.type';

interface AnimationContext {
  animation: Animation;
  frame: AnimFrame;
}

interface EditorTarget {
  documentId: DocumentId;
  revision: number;
  sprite: Sprite;
  bank: PaletteBank;
  layer: Layer;
  layerId: LayerId;
  frameId: FrameId;
  animation?: AnimationContext;
}

/** What the Palette panel works on: a bank, and the sprite using it when one is being edited (none on a palette file). */
interface PaletteTarget {
  documentId: DocumentId;
  revision: number;
  bank: PaletteBank;
  sprite: Sprite | null;
  animation?: AnimationContext;
}

interface BrushPatch {
  patch: BufferView;
  brushId: string | null;
  flipX: boolean;
  flipY: boolean;
  turn: 0 | 90 | 180 | 270;
}

interface BrushOptions {
  brush: Brush;
  pixelPerfect: boolean;
  symmetry: Symmetry;
  wrap?: Wrap;
  ink?: Ink;
  rule?: InkRule | null;
  custom?: BrushPatch | null;
}

interface Overlay {
  width: number;
  height: number;
  base: Uint8Array;
  indices: Uint8Array;
  rgba: Uint8ClampedArray<ArrayBuffer>;
  table: Uint8ClampedArray<ArrayBuffer>;
  dirty: Rect | null;
  revision: number;
  mask: MaskView | null;
}

interface StrokeSession extends Overlay {
  kind: 'stroke';
  tool: StrokeTool;
  index: number;
  inverse: boolean;
  options: BrushOptions;
  points: Point[];
  trails: PerfectTrail[];
}

interface ShapeSpec {
  shape: ShapeKind;
  filled: boolean;
  fillIndex?: number;
  radius: number;
  evenSteps: boolean;
  index: number;
  brush: Brush;
  symmetry: Symmetry;
  wrap?: Wrap;
  ink?: Ink;
  rule: InkRule | null;
  from: Point;
  to: Point;
}

interface ShapeSession extends Overlay {
  kind: 'shape';
  spec: ShapeSpec;
  anchor: Point;
  last: Point;
  label: string;
}

interface PathSpec {
  filled: boolean;
  fillIndex?: number;
  index: number;
  brush: Brush;
  symmetry: Symmetry;
  wrap?: Wrap;
  ink?: Ink;
  rule: InkRule | null;
  pixelPerfect: boolean;
  cubic?: boolean;
}

type PathPhase = 'draw' | 'bend';

interface PathSession extends Overlay {
  kind: 'path';
  tool: PathTool;
  spec: PathSpec;
  vertices: Point[];
  hover: Point;
  handle: Point | null;
  phase: PathPhase;
}

interface GradientSpec {
  colors: number[];
  line: Corners;
  kind: GradientKind;
  reflect: boolean;
  bayer: 2 | 4 | 8 | null;
  pattern: GradientPattern;
  brushId?: string;
  stencil?: BufferView;
  wrap?: Wrap;
}

interface GradientSession extends Overlay {
  kind: 'gradient';
  spec: GradientSpec;
  label: string;
}

interface SprayOptions {
  size: number;
  density: number;
  symmetry: Symmetry;
  wrap?: Wrap;
  ink?: Ink;
  rule: InkRule | null;
}

interface SpraySession extends Overlay {
  kind: 'spray';
  index: number;
  options: SprayOptions;
  seed: number;
  state: number;
  at: Point;
  dots: Point[];
  pressure: number;
}

type PaintSession = StrokeSession | ShapeSession | PathSession | GradientSession | SpraySession;

interface StrokeStart {
  target: EditorTarget;
  tool: StrokeTool;
  index: number;
  inverse?: boolean;
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
  wrap?: Wrap;
  ink?: Ink;
  symmetry?: Symmetry;
  sample?: 'layer' | 'visible';
  match?: 'index' | 'ramp';
}

type SymmetryFields = Pick<ToolSettings, 'symmetryX' | 'symmetryY' | 'axisX' | 'axisY'>;

type ZoomStep = 'in' | 'out' | 'fit' | 'actual';

type HistoryDirection = 'undo' | 'redo';

export type {
  AnimationContext, BrushOptions, BrushPatch, EditorTarget, FillChoice, GradientSession, GradientSpec, HistoryDirection, Overlay, PaintSession, PathSession, PathSpec,
  PaletteTarget, ShapeSession, ShapeSpec, ShapeStart, SprayOptions, SpraySession, StrokeSession, StrokeStart, SymmetryFields, ZoomStep,
};
