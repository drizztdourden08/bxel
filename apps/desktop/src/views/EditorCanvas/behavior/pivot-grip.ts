/* @layer renderer-app @kind logic */
import type { Pivot2 } from '@bxel/document';
import type { PixelViewportHandle } from '../../PixelViewport';
import type { ClientPoint, PivotAxis, PivotFrame } from './canvas-tools.type';
import { gripHit } from './grip-hit';

const pivotGrip = (handle: PixelViewportHandle, frame: PivotFrame, pivot: Pivot2, at: ClientPoint): PivotAxis | null => {
  const lines = { x: frame.x + pivot.x2 / 2, y: frame.y + pivot.y2 / 2, allowX: true, allowY: true };
  return gripHit(handle, lines, { width: frame.imageWidth, height: frame.imageHeight }, at);
};

export { pivotGrip };
