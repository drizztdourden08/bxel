/* @layer renderer-app @kind logic */
import type { ToolId } from '../../../editor/tool.type';
import { MAP_CANVAS_CLASS } from '../TilemapCanvas.constants';

const viewportClass = (tool: ToolId): string => `${MAP_CANVAS_CLASS.viewport} ${MAP_CANVAS_CLASS.viewport}--${tool}`;

export { viewportClass };
