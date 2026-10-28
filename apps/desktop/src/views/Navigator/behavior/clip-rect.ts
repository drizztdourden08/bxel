/* @layer renderer-app @kind logic */
import type { ImageRect } from '../Navigator.type';

const clipRect = (rect: ImageRect, image: { width: number; height: number }): ImageRect => {
  const left = Math.max(0, rect.x);
  const top = Math.max(0, rect.y);
  const right = Math.min(image.width, rect.x + rect.width);
  const bottom = Math.min(image.height, rect.y + rect.height);
  return { x: left, y: top, width: Math.max(0, right - left), height: Math.max(0, bottom - top) };
};

export { clipRect };
