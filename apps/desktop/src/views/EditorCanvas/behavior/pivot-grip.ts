/* @layer renderer-app @kind logic */
import type { Pivot2 } from '@bxel/document';
import type { PixelViewportHandle } from '../../PixelViewport';
import { AXIS_GRAB } from '../EditorCanvas.constants';
import type { ClientPoint, PivotAxis, PivotFrame } from './canvas-tools.type';

const near = (value: number, target: number, reach: number): boolean => Math.abs(value - target) <= reach;

const atEnds = (value: number, start: number, end: number): boolean => near(value, start, AXIS_GRAB.along) || near(value, end, AXIS_GRAB.along);

const pivotGrip = (handle: PixelViewportHandle, frame: PivotFrame, pivot: Pivot2, at: ClientPoint): PivotAxis | null => {
  const origin = handle.pixelToScreen(0, 0);
  const { zoom } = handle.view();
  const lineX = origin.x + (frame.x + pivot.x2 / 2) * zoom;
  const lineY = origin.y + (frame.y + pivot.y2 / 2) * zoom;
  if (near(at.clientX, lineX, AXIS_GRAB.across) && atEnds(at.clientY, origin.y, origin.y + frame.imageHeight * zoom)) return 'x';
  if (near(at.clientY, lineY, AXIS_GRAB.across) && atEnds(at.clientX, origin.x, origin.x + frame.imageWidth * zoom)) return 'y';
  return null;
};

export { pivotGrip };
