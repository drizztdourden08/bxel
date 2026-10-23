/* @layer core @kind logic */
import type { DitherPlan } from './palette-map.type';

const ditherOffset = (plan: DitherPlan, x: number, y: number): number => {
  const mask = plan.size - 1;
  const row = (y + plan.originY) & mask;
  const column = (x + plan.originX) & mask;
  return plan.offsets[row * plan.size + column] ?? 0;
};

export { ditherOffset };
