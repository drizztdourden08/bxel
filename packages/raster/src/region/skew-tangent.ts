/* @layer core @kind logic */
import { HALF_TURN_DEGREES, SKEW_CEILING } from './skew-tangent.constants';

const skewTangent = (degrees: number): number => Math.tan((Math.min(Math.max(degrees, -SKEW_CEILING), SKEW_CEILING) * Math.PI) / HALF_TURN_DEGREES);

export { skewTangent };
