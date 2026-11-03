/* @layer renderer-app @kind logic */
import type { NavigatorWheelPoint } from '@drizztdourden08/tessera';
import { useViewStore } from '../../../stores/useViewStore';

const wheelZoom = (direction: 1 | -1, at: NavigatorWheelPoint): void => {
  const { viewport } = useViewStore.getState();
  if (!viewport) return;
  const anchor = viewport.pixelToScreen(at.x, at.y);
  if (direction === 1) viewport.zoomIn(anchor);
  else viewport.zoomOut(anchor);
};

export { wheelZoom };
