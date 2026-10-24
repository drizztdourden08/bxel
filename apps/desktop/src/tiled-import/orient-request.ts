/* @layer renderer-app @kind logic */
import type { TiledPlan } from '@bxel/formats';

const orientRequest = (plan: TiledPlan): Record<string, unknown> | undefined => {
  if (plan.orientation === 'orthogonal') return undefined;
  const stagger = { staggerAxis: plan.staggerAxis, staggerIndex: plan.staggerIndex };
  if (plan.orientation === 'isometric') return { kind: 'isometric' };
  if (plan.orientation === 'staggered') return { kind: 'staggered', ...stagger };
  return { kind: 'hexagonal', ...stagger, hexSideLength: plan.hexSideLength };
};

export { orientRequest };
