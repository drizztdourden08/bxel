/* @layer renderer-app @kind logic */
import type { ToolId } from '../tool.type';
import { TOOL_SLOTS } from './tool-catalogue.constants';

const toolIds = (): ToolId[] => [...new Set(TOOL_SLOTS.map((slot) => slot.tool))];

export { toolIds };
