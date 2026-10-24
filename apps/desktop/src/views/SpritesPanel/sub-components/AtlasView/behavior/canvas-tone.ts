/* @layer renderer-app @kind logic */
const canvasTone = (canvas: HTMLCanvasElement, name: string): string => getComputedStyle(canvas).getPropertyValue(name).trim() || 'currentColor';

export { canvasTone };
