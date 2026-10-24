/* @layer renderer-app @kind logic */
import type { CellFlags, Point } from '@bxel/document';

const cellSource = (flags: CellFlags, size: number, at: Point): Point => {
  const x = flags.flipX ? size - 1 - at.x : at.x;
  const y = flags.flipY ? size - 1 - at.y : at.y;
  return flags.diagonal ? { x: y, y: x } : { x, y };
};

export { cellSource };
