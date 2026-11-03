/* @layer renderer-app @kind logic */
import type { NavigatorWheelPoint } from '@drizztdourden08/tessera';
import { useViewStore } from '../../../stores/useViewStore';
import { WHEEL_NOTCH } from '../Navigator.constants';

const carried = { total: 0 };

const wheelZoom = (direction: 1 | -1, at: NavigatorWheelPoint, deltaY: number): void => {
  carried.total += deltaY;
  const steps = Math.trunc(carried.total / WHEEL_NOTCH);
  if (steps === 0) return;
  carried.total -= steps * WHEEL_NOTCH;
  const { viewport } = useViewStore.getState();
  if (!viewport) return;
  const anchor = viewport.pixelToScreen(at.x, at.y);
  if (direction === 1) viewport.zoomIn(anchor);
  else viewport.zoomOut(anchor);
};

export { wheelZoom };
