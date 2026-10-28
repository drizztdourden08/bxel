/* @layer renderer-app @kind constants */
import type { ToolSettings } from './tool-store.type';

const TOOL_DEFAULTS: ToolSettings = {
  tool: 'pencil',
  previousTool: null,
  activeSurface: 'paint',
  surfaceTools: { paint: 'pencil', map: 'pencil', sheet: 'hand' },
  recentMembers: { paint: [], map: [], sheet: [] },
  optionMemory: {},
  shareBrush: false,
  foreground: 1,
  background: 0,
  third: 2,
  fourth: 3,
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

const RECENT_LIMIT = 5;

export { BRUSH_SIZE, RECENT_LIMIT, TOOL_DEFAULTS };
