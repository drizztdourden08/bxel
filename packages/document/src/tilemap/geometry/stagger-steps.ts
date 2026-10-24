/* @layer core @kind logic */
import type { Size } from '../../model/geometry.type';
import type { MapOrientation } from '../../model/tilemap.type';
import type { Steps } from './stagger-steps.type';

const staggerSteps = (tile: Size, orientation: MapOrientation): Steps => {
  const side = orientation.kind === 'hexagonal' ? orientation.hexSideLength : 0;
  return orientation.staggerAxis === 'y'
    ? { column: tile.width, row: (tile.height + side) / 2 }
    : { column: (tile.width + side) / 2, row: tile.height };
};

export { staggerSteps };
