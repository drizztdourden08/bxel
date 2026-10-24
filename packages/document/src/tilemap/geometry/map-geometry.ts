/* @layer core @kind logic */
import type { GeometryRequest, MapGeometry } from './geometry.type';
import { isometricGeometry } from './isometric-geometry';
import { orthogonalGeometry } from './orthogonal-geometry';
import { staggerGeometry } from './stagger-geometry';

const mapGeometry = (request: GeometryRequest): MapGeometry => {
  const shape = { grid: { width: request.columns, height: request.rows }, tile: request.tile };
  const { orientation } = request;
  if (!orientation) return orthogonalGeometry(shape);
  return orientation.kind === 'isometric' ? isometricGeometry(shape) : staggerGeometry(shape, orientation);
};

export { mapGeometry };
