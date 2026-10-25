/* @layer renderer-app @kind logic */
import { focusTarget } from './focus-target';
import { isShown } from './is-shown';
import { MODAL_SELECTOR, REGION_SELECTOR } from './regions.constants';

const outermost = (region: HTMLElement, all: readonly HTMLElement[]): boolean => !all.some((other) => other !== region && other.contains(region));

const regionTargets = (): HTMLElement[] => {
  const modal = [...document.querySelectorAll<HTMLElement>(MODAL_SELECTOR)].find(isShown);
  const scope: ParentNode = modal ?? document;
  const found = [...scope.querySelectorAll<HTMLElement>(REGION_SELECTOR)].filter((region) => isShown(region) && focusTarget(region) !== null);
  return found.filter((region) => outermost(region, found));
};

export { regionTargets };
