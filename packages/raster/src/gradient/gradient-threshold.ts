/* @layer core @kind logic */
import type { BufferView } from '../buffer.type';
import type { Point } from '../geometry.type';
import { maskCell } from '../pattern/mask-cell';
import { tileCell } from '../pattern/tile-cell';
import type { DitherGrid } from './gradient-dither.type';
import { HIGH, LOW } from './gradient-threshold.constants';
import type { GradientPattern } from './gradient.type';

const ORIGIN = { x: 0, y: 0 } as const;

const wrapped = (value: number, side: number): number => ((value % side) + side) % side;

const gradientThreshold = (pattern: GradientPattern, grid: DitherGrid, at: Point, stencil?: BufferView): number => {
  const { matrix, side } = grid;
  if (stencil) return maskCell(stencil, ORIGIN, at.x, at.y) ? LOW : HIGH;
  if (pattern !== 'bayer') return tileCell(pattern, at.x, at.y) ? LOW : HIGH;
  return ((matrix[wrapped(at.y, side) * side + wrapped(at.x, side)] ?? 0) + 0.5) / (side * side);
};

export { gradientThreshold };
