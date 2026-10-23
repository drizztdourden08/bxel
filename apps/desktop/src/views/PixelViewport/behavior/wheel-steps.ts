/* @layer renderer-app @kind logic */
import { WHEEL } from '../PixelViewport.constants';
import type { WheelSteps } from './viewport.type';

const wheelSteps = (carried: number, delta: number): WheelSteps => {
  if (Math.abs(delta) >= WHEEL.notch) return { steps: -Math.sign(delta), carried: 0 };
  const total = carried * delta >= 0 ? carried + delta : delta;
  if (Math.abs(total) < WHEEL.pinchStep) return { steps: 0, carried: total };
  return { steps: -Math.sign(total), carried: 0 };
};

export { wheelSteps };
