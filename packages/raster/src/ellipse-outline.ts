/* @layer core @kind logic */
import type { EllipseState } from './ellipse.type';
import type { Corners, Point } from './geometry.type';
import { normalizeCorners } from './normalize-corners';

const plotQuadrants = (points: Point[], state: EllipseState): void => {
  points.push(
    { x: state.right, y: state.lower },
    { x: state.left, y: state.lower },
    { x: state.left, y: state.upper },
    { x: state.right, y: state.upper },
  );
};

const finishTips = (points: Point[], state: EllipseState, height: number): void => {
  while (state.lower - state.upper <= height) {
    points.push(
      { x: state.left - 1, y: state.lower },
      { x: state.right + 1, y: state.lower },
      { x: state.left - 1, y: state.upper },
      { x: state.right + 1, y: state.upper },
    );
    state.lower++;
    state.upper--;
  }
};

const ellipseOutline = (corners: Corners): Point[] => {
  const { x0, y0, x1, y1 } = normalizeCorners(corners);
  const a = x1 - x0;
  const b = y1 - y0;
  const odd = b % 2;
  const stepY = 8 * a * a;
  const stepX = 8 * b * b;
  const middle = y0 + Math.floor((b + 1) / 2);
  const dx = 4 * (1 - a) * b * b;
  const dy = 4 * (odd + 1) * a * a;
  const state: EllipseState = { left: x0, right: x1, lower: middle, upper: middle - odd, err: dx + dy + odd * a * a, dx, dy };
  const points: Point[] = [];
  do {
    plotQuadrants(points, state);
    const doubled = 2 * state.err;
    if (doubled <= state.dy) {
      state.lower++;
      state.upper--;
      state.dy += stepY;
      state.err += state.dy;
    }
    if (doubled >= state.dx || 2 * state.err > state.dy) {
      state.left++;
      state.right--;
      state.dx += stepX;
      state.err += state.dx;
    }
  } while (state.left <= state.right);
  finishTips(points, state, b);
  return points;
};

export { ellipseOutline };
