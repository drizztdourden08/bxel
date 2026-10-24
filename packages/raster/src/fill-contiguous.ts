/* @layer core @kind logic */
import type { Bounds } from './bounds.type';
import { boundsToRect } from './bounds-to-rect';
import { createBounds } from './create-bounds';
import { SHORT_RUN } from './fill.constants';
import type { FillPlan } from './fill.type';
import type { Rect, Span } from './geometry.type';
import { growBounds } from './grow-bounds';
import { maskAllows } from './mask-allows';

const isOpen = (plan: FillPlan, x: number, y: number): boolean => {
  const { target } = plan;
  if (x < 0 || y < 0 || x >= target.width || y >= target.height) {
    return false;
  }
  return target.pixels[y * target.width + x] === plan.match && (plan.mask === null || maskAllows(plan.mask, x, y));
};

const findRun = (plan: FillPlan, x: number, y: number): Span => {
  let left = x;
  while (isOpen(plan, left - 1, y)) {
    left--;
  }
  let right = x;
  while (isOpen(plan, right + 1, y)) {
    right++;
  }
  return { y, x0: left, x1: right };
};

const paintRun = (plan: FillPlan, bounds: Bounds, run: Span): void => {
  const row = run.y * plan.target.width;
  const { pixels } = plan.target;
  if (run.x1 - run.x0 < SHORT_RUN) {
    for (let x = row + run.x0; x <= row + run.x1; x++) {
      pixels[x] = plan.index;
    }
  } else {
    pixels.fill(plan.index, row + run.x0, row + run.x1 + 1);
  }
  growBounds(bounds, run.x0, run.y);
  growBounds(bounds, run.x1, run.y);
};

const seedRow = (plan: FillPlan, stack: number[], run: Span, y: number): void => {
  let inside = false;
  for (let x = run.x0 - plan.reach; x <= run.x1 + plan.reach; x++) {
    const open = isOpen(plan, x, y);
    if (open && !inside) {
      stack.push(x, y);
    }
    inside = open;
  }
};

const fillContiguous = (plan: FillPlan): Rect | null => {
  const bounds = createBounds();
  const stack: number[] = [plan.seed.x, plan.seed.y];
  while (stack.length > 0) {
    const y = stack.pop() ?? 0;
    const x = stack.pop() ?? 0;
    if (isOpen(plan, x, y)) {
      const run = findRun(plan, x, y);
      paintRun(plan, bounds, run);
      seedRow(plan, stack, run, y - 1);
      seedRow(plan, stack, run, y + 1);
    }
  }
  return boundsToRect(bounds);
};

export { fillContiguous };
