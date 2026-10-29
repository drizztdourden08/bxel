/* @layer renderer-app @kind constants */
import type { StrokeTool } from './tool.type';

const ERASE_INDEX = 0;

const STROKE_LABELS: Readonly<Record<StrokeTool, string>> = {
  pencil: 'Pencil stroke',
  eraser: 'Eraser stroke',
};

const FILL_LABEL = 'Fill';

const GRADIENT_LABEL = 'Gradient';

const SPRAY_LABEL = 'Spray';

const POINT_LIMIT = 4096;

export { ERASE_INDEX, FILL_LABEL, GRADIENT_LABEL, POINT_LIMIT, SPRAY_LABEL, STROKE_LABELS };
