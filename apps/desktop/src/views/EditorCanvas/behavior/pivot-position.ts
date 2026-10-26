/* @layer renderer-app @kind logic */
import type { PixelViewportHandle } from '../../PixelViewport';
import type { ClientPoint, PivotAxis, PivotFrame } from './canvas-tools.type';

const pivotPosition = (handle: PixelViewportHandle, axis: PivotAxis, frame: PivotFrame, at: ClientPoint): number => {
  const origin = handle.pixelToScreen(0, 0);
  const { zoom } = handle.view();
  const along = axis === 'x' ? (at.clientX - origin.x) / zoom - frame.x : (at.clientY - origin.y) / zoom - frame.y;
  const room = axis === 'x' ? frame.width : frame.height;
  return Math.min(Math.max(Math.round(along * 2), 0), room * 2);
};

export { pivotPosition };
