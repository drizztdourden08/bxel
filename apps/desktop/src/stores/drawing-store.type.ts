/* @layer renderer-app @kind types */
import type { DitherPattern, GradientKind, GradientPattern } from '@bxel/raster';

type InkKind = 'normal' | 'behind' | 'lockAlpha' | 'onlyColour' | 'dither' | 'shade' | 'lighten' | 'darken' | 'pattern';

type PatternAlign = 'canvas' | 'start';

type FilledTool = 'rect' | 'ellipse' | 'curve' | 'polygon' | 'contour';

type FillColour = 'same' | 'back';

type PickSample = 'visible' | 'layer';

type FillSample = 'layer' | 'visible';

type FillMatch = 'index' | 'ramp';

type GradientMode = 'bands' | 'dither';

type DitherSize = 2 | 4 | 8;

type LinkedChoice = 'ask' | 'unlink' | 'all';

type CelsChoice = 'frame' | 'selected';

type EraseMode = 'all' | 'colour';

type MoveTarget = 'selection' | 'layer';

type NudgeUnit = 'pixel' | 'tile';

type BrushMode = 'colour' | 'stencil';

type SymmetryMode = 'diagonal' | 'turn' | 'tile';

interface DrawingSettings {
  inks: Readonly<Record<string, InkKind>>;
  onlyColour: number | null;
  eraseMode: EraseMode;
  moveTarget: MoveTarget;
  nudgeUnit: NudgeUnit;
  moveAutoPick: boolean;
  fillStopAtTiles: boolean;
  shapeFromCentre: boolean;
  ditherPattern: DitherPattern;
  ditherLevel: number;
  ditherCustom: boolean;
  shadeMode: 'shade' | 'lighten' | 'darken';
  shadeSteps: number;
  shadeRamp: string | null;
  patternAlign: PatternAlign;
  filled: Readonly<Record<FilledTool, boolean>>;
  fillColour: FillColour;
  cornerRadius: number;
  evenSteps: boolean;
  curvePerfect: boolean;
  curveCubic: boolean;
  contourPerfect: boolean;
  pickSample: PickSample;
  pickReturn: boolean;
  fillSample: FillSample;
  fillMatch: FillMatch;
  sprayDensity: number;
  sprayPressure: boolean;
  stabiliser: number;
  outlineRing: 4 | 8;
  outlineSelOut: boolean;
  outlineFrames: 'frame' | 'tag' | 'all';
  cels: CelsChoice;
  spraySize: number;
  spraySeed: number | null;
  gradientKind: GradientKind;
  gradientMode: GradientMode;
  gradientPattern: GradientPattern;
  gradientCustom: boolean;
  gradientSize: DitherSize;
  gradientReflect: boolean;
  gradientOriginX: number;
  gradientOriginY: number;
  gradientRamp: string | null;
  symmetryDiagonal: boolean;
  symmetryTurn: boolean;
  symmetryTile: boolean;
  lockToTile: boolean;
  linkedChoice: LinkedChoice;
  brushId: string | null;
  patternId: string | null;
  brushSpacing: number;
  brushMode: BrushMode;
  brushFlipX: boolean;
  brushFlipY: boolean;
  brushTurn: 0 | 90 | 180 | 270;
}

interface DrawingState extends DrawingSettings {
  patch: (change: Partial<DrawingSettings>) => void;
  setFilled: (tool: FilledTool, filled: boolean) => void;
  setInk: (tool: string, ink: InkKind) => void;
  toggleSymmetryMode: (mode: SymmetryMode) => void;
}

export type {
  CelsChoice,
  DrawingSettings,
  DrawingState,
  EraseMode,
  FillColour,
  FilledTool,
  FillMatch,
  FillSample,
  GradientMode,
  InkKind,
  PatternAlign,
  PickSample,
  SymmetryMode,
};
