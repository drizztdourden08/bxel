/* @layer core @kind logic */
import type { AffineSpec, Matrix2 } from './affine.type';
import { multiplyMatrix } from './multiply-matrix';
import { rotationTerms } from './rotation-terms';
import { skewTangent } from './skew-tangent';

const affineMatrix = (spec: AffineSpec): Matrix2 => {
  if (spec.matrix) return spec.matrix;
  const terms = rotationTerms(spec.angle);
  const turn: Matrix2 = [terms.cos, -terms.sin, terms.sin, terms.cos];
  const skew: Matrix2 = [1, skewTangent(spec.skew.x), skewTangent(spec.skew.y), 1];
  const scale: Matrix2 = [spec.scale.x, 0, 0, spec.scale.y];
  return multiplyMatrix(turn, multiplyMatrix(skew, scale));
};

export { affineMatrix };
