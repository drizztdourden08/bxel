/* @layer renderer-app @kind logic */
import type { ProjectViewSettings } from '../../../panel-browser/browser-state.type';
import { STEPS } from './wheel-density.constants';
import type { Look } from './wheel-density.type';

const stepOf = (look: Look): number => {
  if (look.density === 'compact') return 0;
  if (look.density === 'comfortable') return 1;
  return Math.max(2, STEPS.findIndex((step) => step.tile === look.tile));
};

const wheelDensity = (look: Look, deltaY: number): Partial<ProjectViewSettings> | null => {
  const at = stepOf(look);
  const next = Math.min(STEPS.length - 1, Math.max(0, at + (deltaY < 0 ? 1 : -1)));
  return next === at ? null : (STEPS[next] ?? null);
};

export { wheelDensity };
