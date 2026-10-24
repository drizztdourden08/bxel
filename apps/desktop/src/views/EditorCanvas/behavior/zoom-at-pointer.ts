/* @layer renderer-app @kind logic */
import type { PixelViewportHandle } from '../../PixelViewport';
import type { ClientPoint } from './canvas-tools.type';

const zoomAtPointer = (viewport: PixelViewportHandle | null, event: ClientPoint, out: boolean): void => {
  const anchor = { x: event.clientX, y: event.clientY };
  if (out) viewport?.zoomOut(anchor);
  else viewport?.zoomIn(anchor);
};

export { zoomAtPointer };
