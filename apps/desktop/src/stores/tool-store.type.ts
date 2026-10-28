/* @layer renderer-app @kind types */
import type { LayerId } from '@bxel/document';
import type { BrushShape, Connectivity, FillMode, Point, ShapeKind } from '@bxel/raster';
import type { ColourSlot } from '../editor/press-plan.type';
import type { ToolId } from '../editor/tool.type';
import type { OptionValue } from '../editor/tool-options/tool-options.type';
import type { Surface } from '../surface/surface.type';

type SymmetryAxis = 'x' | 'y';

type SurfaceKind = 'paint' | 'map' | 'sheet';

interface ToolSettings {
  tool: ToolId;
  previousTool: ToolId | null;
  activeSurface: SurfaceKind;
  surfaceTools: Readonly<Record<SurfaceKind, ToolId>>;
  recentMembers: Readonly<Record<SurfaceKind, readonly string[]>>;
  optionMemory: Readonly<Record<string, OptionValue>>;
  shareBrush: boolean;
  foreground: number;
  background: number;
  third: number;
  fourth: number;
  brushSize: number;
  brushShape: BrushShape;
  pixelPerfect: boolean;
  fillMode: FillMode;
  connectivity: Connectivity;
  shape: ShapeKind;
  filled: boolean;
  symmetryX: boolean;
  symmetryY: boolean;
  axisX: number | null;
  axisY: number | null;
  lastPoint: Point | null;
  layerId: LayerId | null;
}

interface ToolState extends ToolSettings {
  selectTool: (tool: ToolId) => void;
  setTool: (tool: ToolId) => void;
  enterSurface: (surface: Surface) => void;
  recordMember: (memberId: string) => void;
  loadOptionMemory: (memory: Readonly<Record<string, OptionValue>>) => void;
  setShareBrush: (share: boolean) => void;
  setForeground: (index: number) => void;
  setBackground: (index: number) => void;
  setColour: (slot: ColourSlot, index: number) => void;
  swapColors: () => void;
  swapPairs: () => void;
  setLayer: (layerId: LayerId | null) => void;
  setBrushSize: (size: number) => void;
  stepBrushSize: (delta: number) => void;
  setBrushShape: (shape: BrushShape) => void;
  setPixelPerfect: (on: boolean) => void;
  setFillMode: (mode: FillMode) => void;
  setConnectivity: (connectivity: Connectivity) => void;
  setShape: (shape: ShapeKind) => void;
  setFilled: (filled: boolean) => void;
  toggleSymmetry: (axis: SymmetryAxis) => void;
  setAxis: (axis: SymmetryAxis, doubled: number | null) => void;
  setLastPoint: (point: Point | null) => void;
}

export type { SurfaceKind, SymmetryAxis, ToolSettings, ToolState };
