/* @layer renderer-app @kind logic */
import { toolIds } from '../tool-catalogue/tool-ids';
import type { ToolId } from '../tool.type';

const isSpringTool = (tool: ToolId): boolean => toolIds().includes(tool);

export { isSpringTool };
