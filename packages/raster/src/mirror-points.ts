/* @layer core @kind logic */
import type { Point } from './geometry.type';
import type { MirrorOptions } from './symmetry.type';
import { symmetryMaps } from './symmetry-maps';

const mirrorPoints = ({ points, symmetry, span = 1 }: MirrorOptions): Point[][] =>
  symmetryMaps(symmetry, span).map((map) => points.map(map));

export { mirrorPoints };
