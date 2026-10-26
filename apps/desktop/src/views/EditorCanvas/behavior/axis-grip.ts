/* @layer renderer-app @kind logic */
import type { Size } from '@bxel/raster';
import { clampAxis } from '../../../editor/clamp-axis';
import type { SymmetryAxis, ToolSettings } from '../../../stores/tool-store.type';
import type { PixelViewportHandle } from '../../PixelViewport';
import type { ClientPoint } from './canvas-tools.type';
import { gripHit } from './grip-hit';

const axisGrip = (handle: PixelViewportHandle, tools: ToolSettings, size: Size, at: ClientPoint): SymmetryAxis | null => {
  const lines = { x: clampAxis(tools.axisX, size.width) / 2, y: clampAxis(tools.axisY, size.height) / 2, allowX: tools.symmetryX, allowY: tools.symmetryY };
  return gripHit(handle, lines, size, at);
};

export { axisGrip };
