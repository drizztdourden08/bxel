/* @layer renderer-app @kind constants */
const BRUSH_DRAG_PIXELS = 14;

const BRUSH_RESIZE_SLOP = 2;

const BRUSH_SIZE_ANNOUNCE = (size: number): string => `Brush size ${size}`;

const BRUSH_RESIZE_LABEL = (size: number): string => `Size ${size}`;

export { BRUSH_DRAG_PIXELS, BRUSH_SIZE_ANNOUNCE, BRUSH_RESIZE_LABEL, BRUSH_RESIZE_SLOP };
