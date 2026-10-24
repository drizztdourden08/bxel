/* @layer renderer-app @kind constants */
import type { ToolSettings } from './tool-store.type';

const TOOL_DEFAULTS: ToolSettings = {
  tool: 'pencil',
  foreground: 1,
  background: 0,
  brushSize: 1,
  brushShape: 'square',
  pixelPerfect: false,
  fillMode: 'contiguous',
  connectivity: 4,
  shape: 'line',
  filled: false,
  symmetryX: false,
  symmetryY: false,
  axisX: null,
  axisY: null,
  lastPoint: null,
  layerId: null,
};

const BRUSH_SIZE = { min: 1, max: 64 } as const;

export { BRUSH_SIZE, TOOL_DEFAULTS };
