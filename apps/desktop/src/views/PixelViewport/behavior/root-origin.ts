/* @layer renderer-app @kind logic */
import type { PixelPoint } from '../PixelViewport.type';

const rootOrigin = (root: HTMLElement | null): PixelPoint => {
  if (!root) return { x: 0, y: 0 };
  const rect = root.getBoundingClientRect();
  return { x: rect.left + root.clientLeft, y: rect.top + root.clientTop };
};

export { rootOrigin };
