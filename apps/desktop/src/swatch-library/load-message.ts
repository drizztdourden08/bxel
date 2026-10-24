/* @layer renderer-app @kind logic */
import { LIBRARY_TEXT } from './swatch-library.constants';
import type { LoadPlan } from './swatch-library.type';

const loadMessage = (plan: LoadPlan, cap: number): string => {
  const head = plan.mode === 'append' ? LIBRARY_TEXT.appended(plan.colors.length) : LIBRARY_TEXT.replaced(plan.colors.length);
  const notes = [
    plan.dropped > 0 ? LIBRARY_TEXT.droppedLimit(plan.dropped, cap) : '',
    plan.skipped > 0 ? LIBRARY_TEXT.skipped(plan.skipped) : '',
  ].filter((note) => note !== '');
  return [head, ...notes].join(' ');
};

export { loadMessage };
