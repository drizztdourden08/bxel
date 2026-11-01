/* @layer renderer-app @kind logic */
import { BRUSH_DRAG_PIXELS } from './brush-resize.constants';
import { clampBrushSize } from './clamp-brush-size';

const brushSizeFromDrag = (startSize: number, deltaX: number): number => clampBrushSize(startSize + Math.round(deltaX / BRUSH_DRAG_PIXELS));

export { brushSizeFromDrag };
