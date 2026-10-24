/* @layer renderer-app @kind logic */
import type { ToolId } from '../../../editor/tool.type';
import { CANVAS_CLASS } from '../EditorCanvas.constants';

const viewportClass = (tool: ToolId): string => `${CANVAS_CLASS.viewport} ${CANVAS_CLASS.viewport}--${tool}`;

export { viewportClass };
