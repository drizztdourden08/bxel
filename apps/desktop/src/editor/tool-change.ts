/* @layer renderer-app @kind logic */
import type { ToolSettings } from '../stores/tool-store.type';
import { nextOf } from './next-of';
import { switchTool } from './switch-tool';
import { FILL_MODES, SHAPE_KINDS } from './tools.constants';
import type { ToolId } from './tool.type';

const toolChange = (settings: ToolSettings, tool: ToolId): Partial<ToolSettings> => {
  if (settings.tool !== tool) return switchTool(settings, tool);
  if (tool === 'shape') return { shape: nextOf(SHAPE_KINDS, settings.shape) };
  if (tool === 'fill') return { fillMode: nextOf(FILL_MODES, settings.fillMode) };
  return {};
};

export { toolChange };
