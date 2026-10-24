/* @layer renderer-app @kind logic */
import type { ToolId } from '../../../editor/tool.type';
import { CANVAS_CLASS } from '../EditorCanvas.constants';

const viewportClass = (tool: ToolId): string => (tool === 'zoom' ? CANVAS_CLASS.zoom : CANVAS_CLASS.viewport);

export { viewportClass };
