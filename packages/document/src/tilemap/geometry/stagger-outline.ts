/* @layer core @kind logic */
import type { Point, Size } from '../../model/geometry.type';
import type { MapOrientation } from '../../model/tilemap.type';

const staggeredOutline = (origin: Point, tile: Size): readonly Point[] => [
  { x: origin.x + tile.width / 2, y: origin.y },
  { x: origin.x + tile.width, y: origin.y + tile.height / 2 },
  { x: origin.x + tile.width / 2, y: origin.y + tile.height },
  { x: origin.x, y: origin.y + tile.height / 2 },
];

const hexOutline = (origin: Point, tile: Size, orientation: MapOrientation): readonly Point[] => {
  const { x, y } = origin;
  const { width, height } = tile;
  const side = orientation.hexSideLength;
  if (orientation.staggerAxis === 'y') {
    const cap = (height - side) / 2;
    return [
      { x: x + width / 2, y },
      { x: x + width, y: y + cap },
      { x: x + width, y: y + cap + side },
      { x: x + width / 2, y: y + height },
      { x, y: y + cap + side },
      { x, y: y + cap },
    ];
  }
  const cap = (width - side) / 2;
  return [
    { x: x + cap, y },
    { x: x + cap + side, y },
    { x: x + width, y: y + height / 2 },
    { x: x + cap + side, y: y + height },
    { x: x + cap, y: y + height },
    { x, y: y + height / 2 },
  ];
};

const staggerOutline = (origin: Point, tile: Size, orientation: MapOrientation): readonly Point[] =>
  orientation.kind === 'hexagonal' ? hexOutline(origin, tile, orientation) : staggeredOutline(origin, tile);

export { staggerOutline };
