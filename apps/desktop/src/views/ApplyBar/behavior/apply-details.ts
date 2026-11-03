/* @layer renderer-app @kind logic */
import { APPLY_BAR_TEXT } from '../ApplyBar.constants';
import type { ApplyBarModel } from '../ApplyBar.type';

const applyDetails = (bar: ApplyBarModel): string => {
  if (bar.error !== null) return bar.error;
  const { scope } = bar;
  return APPLY_BAR_TEXT.details([APPLY_BAR_TEXT.targets(scope.targets), APPLY_BAR_TEXT.layers(scope.layers), APPLY_BAR_TEXT.clipping(bar.clipping)]);
};

export { applyDetails };
