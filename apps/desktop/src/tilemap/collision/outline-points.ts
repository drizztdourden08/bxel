/* @layer renderer-app @kind logic */
import type { Point, Size, TileCollision } from '@bxel/document';

const outlinePoints = (collision: TileCollision, tile: Size): readonly Point[] => {
  if (collision.kind === 'polygon') return collision.points;
  const rect = collision.kind === 'rect' ? collision : { x: 0, y: 0, width: tile.width, height: tile.height };
  return [
    { x: rect.x, y: rect.y },
    { x: rect.x + rect.width, y: rect.y },
    { x: rect.x + rect.width, y: rect.y + rect.height },
    { x: rect.x, y: rect.y + rect.height },
  ];
};

export { outlinePoints };
