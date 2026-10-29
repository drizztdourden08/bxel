/* @layer renderer-app @kind logic */
import { ANGLE_SNAP } from './transform.constants';

const snapAngle = (angle: number, step: number = ANGLE_SNAP): number => Math.round(angle / step) * step;

export { snapAngle };
