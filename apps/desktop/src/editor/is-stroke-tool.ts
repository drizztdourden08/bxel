/* @layer renderer-app @kind logic */
import type { PathTool, ShapeTool, StrokeTool, ToolId } from './tool.type';

const isStrokeTool = (tool: ToolId): tool is StrokeTool => tool === 'pencil' || tool === 'eraser';

const isShapeTool = (tool: ToolId): tool is ShapeTool => tool === 'line' || tool === 'rect' || tool === 'ellipse';

const isPathTool = (tool: ToolId): tool is PathTool => tool === 'curve' || tool === 'polygon' || tool === 'contour';

export { isPathTool, isShapeTool, isStrokeTool };
