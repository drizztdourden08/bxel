/* @layer renderer-app @kind logic */
import type { ToolId } from '../../../editor/tool.type';

const toolCursorClass = (tool: ToolId): string => `editor-canvas__viewport--${tool}`;

export { toolCursorClass };
