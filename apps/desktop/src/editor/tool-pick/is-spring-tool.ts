/* @layer renderer-app @kind logic */
import type { ToolId } from '../tool.type';
import { SPRING_TOOLS } from './spring-tool.constants';

const isSpringTool = (tool: ToolId): boolean => SPRING_TOOLS.includes(tool);

export { isSpringTool };
