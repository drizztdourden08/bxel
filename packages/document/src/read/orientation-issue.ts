/* @layer core @kind logic */
import type { MapOrientation, Tileset } from '../model/tilemap.type';

const even = (value: number): boolean => value % 2 === 0;

const hexIssue = (orientation: MapOrientation, tileset: Tileset): string | null => {
  const across = orientation.staggerAxis === 'y' ? tileset.tileHeight : tileset.tileWidth;
  const other = orientation.staggerAxis === 'y' ? tileset.tileWidth : tileset.tileHeight;
  const side = orientation.hexSideLength;
  if (side < 1 || side >= across) return `A hexagon side is 1 to ${across - 1} pixels for ${tileset.tileWidth} x ${tileset.tileHeight} tiles.`;
  return even(other) && even(across + side) ? null : 'Hexagon tiles need an even size across the stagger and an even tile size plus side.';
};

const orientationIssue = (orientation: MapOrientation, tileset: Tileset): string | null => {
  if (orientation.kind === 'hexagonal') return hexIssue(orientation, tileset);
  return even(tileset.tileWidth) && even(tileset.tileHeight) ? null : 'Isometric and staggered maps need an even tile width and height.';
};

export { orientationIssue };
