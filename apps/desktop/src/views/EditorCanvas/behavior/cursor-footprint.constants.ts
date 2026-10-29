/* @layer renderer-app @kind constants */
import type { ToolId } from '../../../editor/tool.type';

const BRUSH_FOOTPRINT_TOOLS: readonly ToolId[] = ['pencil', 'shade', 'eraser', 'line', 'curve', 'rect', 'ellipse', 'contour', 'polygon'];

const NO_FOOTPRINT_TOOLS: readonly ToolId[] = ['zoom', 'hand'];

export { BRUSH_FOOTPRINT_TOOLS, NO_FOOTPRINT_TOOLS };
