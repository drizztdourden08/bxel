/* @layer core @kind constants */
import type { BrushAngle } from './brush.type';

const DIRECTION: Readonly<Record<BrushAngle, readonly [number, number]>> = { 0: [1, 0], 45: [1, -1], 90: [0, 1], 135: [1, 1] };

export { DIRECTION };
