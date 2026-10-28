/* @layer renderer-app @kind types */
import type { RulerUnit } from '../ruler/ruler-unit.type';

type PreviewKind = 'canvas' | 'grid' | 'surround';

type SurroundKind ='diagonal' | 'horizontal' | 'vertical' | 'dots' | 'solid' | 'custom';

type CheckerPreset = '4' | '8' | '16' | '32' | 'custom';

interface CanvasSettings {
  canvasRightClick: 'back-colour' | 'menu';
  checkerA: string;
  checkerB: string;
  checkerPreset: CheckerPreset;
  checkerSize: number;
  surroundPattern: SurroundKind;
  surroundA: string;
  surroundB: string;
  surroundScale: number;
  surroundCustom: string;
  gridPixel: boolean;
  gridColor: string;
  gridOpacity: number;
  gridMajor: boolean;
  gridMajorEvery: number;
  gridMajorColor: string;
  gridMajorOpacity: number;
  gridTile: boolean;
  gridTileSize: number;
  gridTileColor: string;
  gridTileOpacity: number;
  guideColor: string;
  rulers: boolean;
  rulerUnit: RulerUnit;
}

interface GridLine {
  colour: string;
  opacity: number;
  every: number;
  everyY?: number;
}

interface CanvasLook {
  checkerA: string;
  checkerB: string;
  checkerSize: number;
  surroundA: string;
  surroundB: string;
  surroundScale: number;
  surroundBits: string;
  pixelLine: GridLine;
  majorLine: GridLine;
  tileLine: GridLine;
}

interface GridFlags {
  pixel: boolean;
  major: boolean;
  tile: boolean;
}

interface NumberRange {
  min: number;
  max: number;
}

interface LineFields {
  colour: unknown;
  opacity: unknown;
  every: unknown;
}

interface LineDefaults {
  colour: string;
  opacity: number;
  every: number;
}

interface PreviewSample {
  x: number;
  y: number;
  width: number;
  height: number;
  colour: string;
  alpha: number;
}

interface SampleSprite {
  size: readonly [number, number];
  tile: readonly [number, number] | null;
  colours: readonly string[];
}

interface TileRect {
  x: number;
  y: number;
  width: number;
  height: number;
}

export type { CanvasLook, CanvasSettings, CheckerPreset, GridFlags, GridLine, LineDefaults, LineFields, NumberRange, PreviewKind, PreviewSample, SampleSprite, SurroundKind, TileRect };
