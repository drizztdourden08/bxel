/* @layer renderer-app @kind logic */
import type { PixelCanvas, PixelImage } from './upload-image.type';

const mirroredSource = new WeakMap<PixelCanvas, PixelImage>();

export { mirroredSource };
