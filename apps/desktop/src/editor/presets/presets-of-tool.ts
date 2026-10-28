/* @layer renderer-app @kind logic */
import { memberById } from '../tool-catalogue/member-by-id';
import type { ToolId } from '../tool.type';
import type { ToolPreset } from './tool-preset.type';

const presetsOfTool = (presets: readonly ToolPreset[], tool: ToolId): ToolPreset[] =>
  presets.filter((preset) => memberById(preset.member)?.member.tool === tool);

export { presetsOfTool };
