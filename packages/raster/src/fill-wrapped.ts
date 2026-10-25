/* @layer core @kind logic */
import { boundsToRect } from './bounds-to-rect';
import { createWriter } from './create-writer';
import { CORNER_STEPS, SIDE_STEPS } from './fill.constants';
import type { FillPlan } from './fill.type';
import { foldPoint } from './fold-point';
import type { Rect } from './geometry.type';
import { maskAllows } from './mask-allows';
import { writePixel } from './write-pixel';

const isInside = (plan: FillPlan, x: number, y: number): boolean =>
  x >= 0 && y >= 0 && x < plan.target.width && y < plan.target.height;

const isOpen = (plan: FillPlan, x: number, y: number): boolean =>
  isInside(plan, x, y) && plan.target.pixels[y * plan.target.width + x] === plan.match && maskAllows(plan.mask, x, y);

const pushNeighbours = (plan: FillPlan, stack: number[], at: { readonly x: number; readonly y: number }): void => {
  const steps = plan.reach === 1 ? [...SIDE_STEPS, ...CORNER_STEPS] : SIDE_STEPS;
  for (const [dx, dy] of steps) {
    const next = foldPoint({ x: at.x + dx, y: at.y + dy }, plan.target, plan.wrap);
    if (isOpen(plan, next.x, next.y)) {
      stack.push(next.x, next.y);
    }
  }
};

const fillWrapped = (plan: FillPlan): Rect | null => {
  const writer = createWriter(plan);
  const stack: number[] = [plan.seed.x, plan.seed.y];
  for (let y = stack.pop(); y !== undefined; y = stack.pop()) {
    const x = stack.pop() ?? 0;
    if (isOpen(plan, x, y)) {
      writePixel(writer, x, y);
      pushNeighbours(plan, stack, { x, y });
    }
  }
  return boundsToRect(writer.bounds);
};

export { fillWrapped };
