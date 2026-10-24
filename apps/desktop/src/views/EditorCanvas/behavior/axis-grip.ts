/* @layer renderer-app @kind logic */
import type { Size } from '@bxel/raster';
import { clampAxis } from '../../../editor/clamp-axis';
import type { SymmetryAxis, ToolSettings } from '../../../stores/tool-store.type';
import type { PixelViewportHandle } from '../../PixelViewport';
import { AXIS_GRAB } from '../EditorCanvas.constants';
import type { ClientPoint } from './canvas-tools.type';

const near = (value: number, target: number, reach: number): boolean => Math.abs(value - target) <= reach;

const atEnds = (value: number, start: number, end: number): boolean => near(value, start, AXIS_GRAB.along) || near(value, end, AXIS_GRAB.along);

const axisGrip = (handle: PixelViewportHandle, tools: ToolSettings, size: Size, at: ClientPoint): SymmetryAxis | null => {
  const origin = handle.pixelToScreen(0, 0);
  const { zoom } = handle.view();
  const lineX = origin.x + (clampAxis(tools.axisX, size.width) / 2) * zoom;
  const lineY = origin.y + (clampAxis(tools.axisY, size.height) / 2) * zoom;
  if (tools.symmetryX && near(at.clientX, lineX, AXIS_GRAB.across) && atEnds(at.clientY, origin.y, origin.y + size.height * zoom)) return 'x';
  if (tools.symmetryY && near(at.clientY, lineY, AXIS_GRAB.across) && atEnds(at.clientX, origin.x, origin.x + size.width * zoom)) return 'y';
  return null;
};

export { axisGrip };
