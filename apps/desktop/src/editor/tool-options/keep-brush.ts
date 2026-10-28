/* @layer renderer-app @kind logic */
import type { ToolSettings } from '../../stores/tool-store.type';
import { brushKeys } from './brush-keys';
import { BRUSH_TOOLS, WITH_PERFECT } from './brush-memory.constants';
import type { OptionValue } from './tool-options.type';

const keepBrush = (settings: ToolSettings, memory: Record<string, OptionValue>): void => {
  const { tool } = settings;
  if (!BRUSH_TOOLS.includes(tool)) return;
  const keys = brushKeys(tool);
  memory[keys.size] = settings.brushSize;
  memory[keys.tip] = settings.brushShape;
  if (WITH_PERFECT.includes(tool)) memory[keys.perfect] = settings.pixelPerfect;
};

export { keepBrush };
