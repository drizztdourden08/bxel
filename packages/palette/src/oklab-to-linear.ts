/* @layer core @kind logic */
import { applyMatrix } from './apply-matrix';
import { LMS_TO_LINEAR, OKLAB_TO_LMS } from './oklab.constants';
import type { Oklab, Triple } from './oklab.type';

const oklabToLinear = (colour: Oklab): Triple => {
  const [l, m, s] = applyMatrix(OKLAB_TO_LMS, [colour.l, colour.a, colour.b]);
  return applyMatrix(LMS_TO_LINEAR, [l ** 3, m ** 3, s ** 3]);
};

export { oklabToLinear };
