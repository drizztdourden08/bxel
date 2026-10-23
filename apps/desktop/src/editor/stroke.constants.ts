/* @layer renderer-app @kind constants */
import type { StrokeTool } from './tool.type';

const ERASE_INDEX = 0;

const STROKE_LABELS: Readonly<Record<StrokeTool, string>> = {
  pencil: 'Pencil stroke',
  eraser: 'Eraser stroke',
};

const FILL_LABEL = 'Fill';

const BRUSH_SHAPE = 'square';

const POINT_LIMIT = 4096;

export { BRUSH_SHAPE, ERASE_INDEX, FILL_LABEL, POINT_LIMIT, STROKE_LABELS };
