/* @layer renderer-app @kind logic */
import type { ToolId } from '../tool.type';
import { TOOL_SLOTS } from './tool-catalogue.constants';

const keyOfTool = (tool: ToolId): string => TOOL_SLOTS.find((slot) => slot.tool === tool)?.key ?? '';

export { keyOfTool };
