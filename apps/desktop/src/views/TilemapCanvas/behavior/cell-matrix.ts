/* @layer renderer-app @kind logic */
import type { CellFlags, Size } from '@bxel/document';

const cellMatrix = (flags: CellFlags, size: Size): readonly [number, number, number, number, number, number] => {
  const x = flags.flipX ? -1 : 1;
  const y = flags.flipY ? -1 : 1;
  const shiftX = flags.flipX ? size.width : 0;
  const shiftY = flags.flipY ? size.height : 0;
  return flags.diagonal ? [0, y, x, 0, shiftX, shiftY] : [x, 0, 0, y, shiftX, shiftY];
};

export { cellMatrix };
