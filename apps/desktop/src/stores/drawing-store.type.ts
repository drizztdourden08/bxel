/* @layer renderer-app @kind types */
import type { DitherPattern, GradientKind, GradientPattern } from '@bxel/raster';

type InkKind = 'normal' | 'behind' | 'lockAlpha' | 'onlyColour' | 'dither' | 'shade' | 'lighten' | 'darken';

type FilledTool = 'rect' | 'ellipse' | 'curve' | 'polygon' | 'contour';

type FillColour = 'same' | 'back';

type PickSample = 'visible' | 'layer';

type FillSample = 'layer' | 'visible';

type FillMatch = 'index' | 'ramp';

type GradientMode = 'bands' | 'dither';

type DitherSize = 2 | 4 | 8;

type LinkedChoice = 'ask' | 'unlink' | 'all';

type BrushMode = 'colour' | 'stencil';

interface DrawingSettings {
  inkKind: InkKind;
  onlyColour: number | null;
  ditherPattern: DitherPattern;
  ditherLevel: number;
  shadeMode: 'shade' | 'lighten' | 'darken';
  shadeSteps: number;
  shadeRamp: string | null;
  filled: Readonly<Record<FilledTool, boolean>>;
  fillColour: FillColour;
  cornerRadius: number;
  evenSteps: boolean;
  curvePerfect: boolean;
  contourPerfect: boolean;
  pickSample: PickSample;
  fillSample: FillSample;
  fillMatch: FillMatch;
  sprayDensity: number;
  spraySize: number;
  spraySeed: number | null;
  gradientKind: GradientKind;
  gradientMode: GradientMode;
  gradientPattern: GradientPattern;
  gradientSize: DitherSize;
  gradientReflect: boolean;
  gradientRamp: string | null;
  symmetryDiagonal: boolean;
  symmetryTurn: boolean;
  lockToTile: boolean;
  linkedChoice: LinkedChoice;
  brushId: string | null;
  brushMode: BrushMode;
  brushFlipX: boolean;
  brushFlipY: boolean;
  brushTurn: 0 | 90 | 180 | 270;
}

interface DrawingState extends DrawingSettings {
  patch: (change: Partial<DrawingSettings>) => void;
  setFilled: (tool: FilledTool, filled: boolean) => void;
  cycleInk: () => void;
  toggleSymmetryMode: (mode: 'diagonal' | 'turn') => void;
}

export type {
  DrawingSettings,
  DrawingState,
  FillColour,
  FilledTool,
  FillMatch,
  FillSample,
  GradientMode,
  InkKind,
  PickSample,
};
