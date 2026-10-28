/* @layer renderer-app @kind logic */
import type { ToolSettings } from '../stores/tool-store.type';
import { keepBrush } from './tool-options/keep-brush';
import { loadBrush } from './tool-options/load-brush';
import type { OptionValue } from './tool-options/tool-options.type';
import type { ToolId } from './tool.type';

const switchTool = (settings: ToolSettings, tool: ToolId): Partial<ToolSettings> => {
  if (settings.tool === tool) return {};
  const memory: Record<string, OptionValue> = { ...settings.optionMemory };
  if (settings.shareBrush) return { tool, previousTool: settings.tool };
  keepBrush(settings, memory);
  return { tool, previousTool: settings.tool, optionMemory: memory, ...loadBrush(tool, memory) };
};

export { switchTool };
