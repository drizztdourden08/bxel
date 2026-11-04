/* @layer renderer-app @kind logic */
import type { RectBox } from './rect-box.type';

const rectCorners = (rect: RectBox) => ({
  from: { x: rect.x, y: rect.y },
  to: { x: rect.x + rect.width - 1, y: rect.y + rect.height - 1 },
});

export { rectCorners };
