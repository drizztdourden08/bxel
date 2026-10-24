/* @layer renderer-app @kind logic */
import { CANVAS_CLASS } from '../EditorCanvas.constants';

const canvasClass = (rulers: boolean): string => (rulers ? CANVAS_CLASS.rulers : CANVAS_CLASS.plain);

export { canvasClass };
