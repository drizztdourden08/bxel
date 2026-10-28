/* @layer renderer-app @kind logic */
import type { BrushShape } from '@bxel/raster';
import { TOOL_DEFAULTS } from '../../stores/tool-store.constants';
import type { ToolSettings } from '../../stores/tool-store.type';
import type { ToolId } from '../tool.type';
import { brushKeys } from './brush-keys';
import { BRUSH_TOOLS, WITH_PERFECT } from './brush-memory.constants';
import type { OptionValue } from './tool-options.type';

const numberOf = (value: OptionValue | undefined, otherwise: number): number => (typeof value === 'number' ? value : otherwise);

const tipOf = (value: OptionValue | undefined): BrushShape => (value === 'circle' ? 'circle' : TOOL_DEFAULTS.brushShape);

const loadBrush = (tool: ToolId, memory: Readonly<Record<string, OptionValue>>): Partial<ToolSettings> => {
  if (!BRUSH_TOOLS.includes(tool)) return {};
  const keys = brushKeys(tool);
  const brush = { brushSize: numberOf(memory[keys.size], TOOL_DEFAULTS.brushSize), brushShape: tipOf(memory[keys.tip]) };
  return WITH_PERFECT.includes(tool) ? { ...brush, pixelPerfect: memory[keys.perfect] === true } : brush;
};

export { loadBrush };
