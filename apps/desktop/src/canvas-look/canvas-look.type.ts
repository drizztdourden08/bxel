/* @layer renderer-app @kind types */
type SurroundKind = 'diagonal' | 'horizontal' | 'vertical' | 'dots' | 'solid' | 'custom';

type CheckerPreset = '4' | '8' | '16' | '32' | 'custom';

interface CanvasSettings {
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
  rulers: boolean;
}

interface GridLine {
  colour: string;
  opacity: number;
  every: number;
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

interface TileRect {
  x: number;
  y: number;
  width: number;
  height: number;
}

export type { CanvasLook, CanvasSettings, CheckerPreset, GridFlags, GridLine, LineDefaults, LineFields, NumberRange, SurroundKind, TileRect };
