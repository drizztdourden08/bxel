/* @layer renderer-app @kind logic */
import type { Surface } from './surface.type';
import type { ToolId } from '../tool.type';
import { slotOfTool } from './slot-of-tool';

const labelOfTool = (surface: Surface, tool: ToolId): string => slotOfTool(surface, tool)?.label ?? tool;

export { labelOfTool };
