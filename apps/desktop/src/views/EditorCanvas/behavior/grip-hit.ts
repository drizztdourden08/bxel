/* @layer renderer-app @kind logic */
import type { Size } from '@bxel/raster';
import type { PixelViewportHandle } from '../../PixelViewport';
import { AXIS_GRAB } from '../EditorCanvas.constants';
import type { ClientPoint, GripLines } from './canvas-tools.type';

const near = (value: number, target: number, reach: number): boolean => Math.abs(value - target) <= reach;

const atEnds = (value: number, start: number, end: number): boolean => near(value, start, AXIS_GRAB.along) || near(value, end, AXIS_GRAB.along);

const gripHit = (handle: PixelViewportHandle, lines: GripLines, size: Size, at: ClientPoint): 'x' | 'y' | null => {
  const origin = handle.pixelToScreen(0, 0);
  const { zoom } = handle.view();
  const lineX = origin.x + lines.x * zoom;
  const lineY = origin.y + lines.y * zoom;
  if (lines.allowX && near(at.clientX, lineX, AXIS_GRAB.across) && atEnds(at.clientY, origin.y, origin.y + size.height * zoom)) return 'x';
  if (lines.allowY && near(at.clientY, lineY, AXIS_GRAB.across) && atEnds(at.clientX, origin.x, origin.x + size.width * zoom)) return 'y';
  return null;
};

export { gripHit };
