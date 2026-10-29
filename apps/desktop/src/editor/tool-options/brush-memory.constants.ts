/* @layer renderer-app @kind constants */
import type { ToolId } from '../tool.type';

const BRUSH_TOOLS: readonly ToolId[] = ['pencil', 'eraser', 'shade', 'line', 'curve', 'rect', 'ellipse', 'contour', 'polygon'];

const WITH_PERFECT: readonly ToolId[] = ['pencil', 'eraser'];

export { BRUSH_TOOLS, WITH_PERFECT };
