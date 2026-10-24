/* @layer renderer-app @kind logic */
import { APPLY_BAR_TEXT } from '../ApplyBar.constants';
import type { ApplyBarModel } from '../ApplyBar.type';

const applyMessage = (bar: ApplyBarModel): string => {
  if (bar.error !== null) return `${bar.title}. ${bar.error}`;
  const { scope } = bar;
  const parts = [bar.title, APPLY_BAR_TEXT.targets(scope.targets), APPLY_BAR_TEXT.layers(scope.layers), APPLY_BAR_TEXT.frames(scope.frames)];
  return `${[...parts, APPLY_BAR_TEXT.clipping(bar.clipping)].join('. ')}.`;
};

export { applyMessage };
