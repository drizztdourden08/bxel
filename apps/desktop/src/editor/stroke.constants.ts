/* @layer renderer-app @kind constants */
import type { StrokeTool } from './tool.type';

const ERASE_INDEX = 0;

const STROKE_LABELS: Readonly<Record<StrokeTool, string>> = {
  pencil: 'Pencil stroke',
  eraser: 'Eraser stroke',
};

const FILL_LABEL = 'Fill';

const POINT_LIMIT = 4096;

export { ERASE_INDEX, FILL_LABEL, POINT_LIMIT, STROKE_LABELS };
