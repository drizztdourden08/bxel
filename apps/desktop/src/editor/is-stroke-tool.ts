/* @layer renderer-app @kind logic */
import type { StrokeTool, ToolId } from './tool.type';

const isStrokeTool = (tool: ToolId): tool is StrokeTool => tool === 'pencil' || tool === 'eraser';

export { isStrokeTool };
