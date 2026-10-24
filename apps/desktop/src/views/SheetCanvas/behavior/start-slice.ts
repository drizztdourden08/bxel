/* @layer renderer-app @kind logic */
import type { Point } from '@bxel/document';
import type { SheetItem } from '../../../sheet/sheet.type';
import type { SheetDrag } from '../SheetCanvas.type';

const startSlice = (hit: SheetItem, at: Point): SheetDrag => {
  const local = { x: at.x - hit.at.x, y: at.y - hit.at.y };
  return { kind: 'slice', sprite: hit.sprite, origin: hit.at, start: local, end: local };
};

export { startSlice };
