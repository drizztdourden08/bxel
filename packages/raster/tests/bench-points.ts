/* @layer tests @kind helper */
import type { Point } from '@bxel/raster';

const TURNS_X = 0.0007;
const TURNS_Y = 0.0011;

const wanderPoints = (count: number, side: number): Point[] => {
  const middle = side / 2;
  const reach = middle * 0.9;
  return Array.from({ length: count }, (_, step) => ({
    x: Math.round(middle + reach * Math.cos(step * TURNS_X)),
    y: Math.round(middle + reach * Math.sin(step * TURNS_Y)),
  }));
};

export { wanderPoints };
