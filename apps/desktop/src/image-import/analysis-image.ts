/* @layer renderer-app @kind logic */
import type { SourceImage } from './image-import.type';

const analysisImage = (image: SourceImage): SourceImage => {
  const { frames } = image;
  if (!frames) return image;
  const size = image.data.length;
  const data = new Uint8ClampedArray(size * frames.length);
  frames.forEach((frame, at) => data.set(frame.data, at * size));
  return { ...image, height: image.height * frames.length, data };
};

export { analysisImage };
