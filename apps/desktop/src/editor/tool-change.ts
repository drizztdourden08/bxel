/* @layer renderer-app @kind logic */
import type { ToolSettings } from '../stores/tool-store.type';
import { FILL_MODES } from './tools.constants';
import type { ToolId } from './tool.type';

const nextOf = <T>(list: readonly T[], current: T): T => list[(list.indexOf(current) + 1) % list.length] ?? current;

const toolChange = (settings: ToolSettings, tool: ToolId): Partial<ToolSettings> => {
  if (settings.tool !== tool) return { tool };
  if (tool === 'fill') return { fillMode: nextOf(FILL_MODES, settings.fillMode) };
  return {};
};

export { toolChange };
