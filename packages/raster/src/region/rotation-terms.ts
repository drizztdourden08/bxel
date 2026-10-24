/* @layer core @kind logic */
import { FULL_TURN_DEGREES, RIGHT_ANGLE_DEGREES, RIGHT_ANGLE_TERMS } from './region.constants';
import type { RotationTerms } from './region.type';

const rotationTerms = (degrees: number): RotationTerms => {
  const turned = ((degrees % FULL_TURN_DEGREES) + FULL_TURN_DEGREES) % FULL_TURN_DEGREES;
  const quarter = RIGHT_ANGLE_TERMS[turned / RIGHT_ANGLE_DEGREES];
  if (quarter) {
    return quarter;
  }
  const radians = (turned * Math.PI) / (FULL_TURN_DEGREES / 2);
  return { cos: Math.cos(radians), sin: Math.sin(radians) };
};

export { rotationTerms };
