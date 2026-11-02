/* @layer renderer-app @kind logic */
import type { TileShape } from '@bxel/document';

const shapeWithoutPoint = (shape: TileShape | undefined, at: number | null): TileShape | null => {
  if (shape?.kind !== 'polygon' || at === null || shape.points.length <= 3) return null;
  return { ...shape, points: shape.points.filter((_point, index) => index !== at) };
};

export { shapeWithoutPoint };
