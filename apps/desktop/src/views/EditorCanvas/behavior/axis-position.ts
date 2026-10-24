/* @layer renderer-app @kind logic */
import type { Size } from '@bxel/raster';
import { snapAxis } from '../../../editor/snap-axis';
import type { SymmetryAxis } from '../../../stores/tool-store.type';
import type { PixelViewportHandle } from '../../PixelViewport';
import type { ClientPoint } from './canvas-tools.type';

const axisPosition = (handle: PixelViewportHandle, axis: SymmetryAxis, size: Size, at: ClientPoint): number => {
  const origin = handle.pixelToScreen(0, 0);
  const { zoom } = handle.view();
  const along = axis === 'x' ? at.clientX - origin.x : at.clientY - origin.y;
  return snapAxis(along / zoom, axis === 'x' ? size.width : size.height, false);
};

export { axisPosition };
