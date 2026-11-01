/* @layer renderer-app @kind logic */
import { uploadImage } from '../../../canvas-dirty/upload-image';
import type { PixelSource } from '../../PixelViewport';

const isImageData = (source: PixelSource): source is ImageData => 'data' in source && 'colorSpace' in source;

const drawable = (source: PixelSource, scratch: HTMLCanvasElement): CanvasImageSource | null => {
  if (!isImageData(source)) return source;
  const ctx = scratch.getContext('2d');
  if (!ctx) return null;
  uploadImage(scratch, ctx, source);
  return scratch;
};

export { drawable };
