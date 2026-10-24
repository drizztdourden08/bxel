/* @layer core @kind logic */
import type { TileShape, TileSize } from './tilemap.type';

const base = (id: number) => ({ id, name: '', type: '', rotation: 0, visible: true });

const tiledCollisionObject = (shape: TileShape, tile: TileSize, id: number): Record<string, unknown> => {
  if (shape.kind === 'full') return { ...base(id), x: 0, y: 0, width: tile.width, height: tile.height };
  if (shape.kind === 'rect') return { ...base(id), x: shape.x, y: shape.y, width: shape.width, height: shape.height };
  const [first] = shape.points;
  const x = first?.x ?? 0;
  const y = first?.y ?? 0;
  return { ...base(id), x, y, width: 0, height: 0, polygon: shape.points.map((point) => ({ x: point.x - x, y: point.y - y })) };
};

export { tiledCollisionObject };
