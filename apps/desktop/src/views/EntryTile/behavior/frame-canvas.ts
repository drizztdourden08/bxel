/* @layer renderer-app @kind logic */
import type { FrameImage } from '../../../sheet/sheet.type';

const frameCanvas = (owner: Document, image: FrameImage): HTMLCanvasElement => {
  const source = owner.createElement('canvas');
  source.width = image.width;
  source.height = image.height;
  source.getContext('2d')?.putImageData(new ImageData(Uint8ClampedArray.from(image.rgba), image.width, image.height), 0, 0);
  return source;
};

export { frameCanvas };
