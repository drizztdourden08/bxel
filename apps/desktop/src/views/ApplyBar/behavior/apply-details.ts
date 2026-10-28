/* @layer renderer-app @kind logic */
import { APPLY_BAR_TEXT } from '../ApplyBar.constants';
import type { ApplyBarModel } from '../ApplyBar.type';

const applyDetails = (bar: ApplyBarModel, docked: boolean): string => {
  if (bar.error !== null) return bar.error;
  const { scope } = bar;
  const parts = [APPLY_BAR_TEXT.targets(scope.targets), APPLY_BAR_TEXT.layers(scope.layers), APPLY_BAR_TEXT.clipping(bar.clipping)];
  return APPLY_BAR_TEXT.details(docked ? [APPLY_BAR_TEXT.docked, ...parts] : parts);
};

export { applyDetails };
