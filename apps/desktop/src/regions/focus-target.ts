/* @layer renderer-app @kind logic */
import { isShown } from './is-shown';
import { FOCUS_SELECTOR, ROVING_SELECTOR } from './regions.constants';

const firstShown = (region: HTMLElement, selector: string): HTMLElement | null =>
  [...region.querySelectorAll<HTMLElement>(selector)].find(isShown) ?? null;

const focusTarget = (region: HTMLElement): HTMLElement | null => {
  if (region.tabIndex >= 0 && region.matches('[role="application"]')) return region;
  return firstShown(region, ROVING_SELECTOR) ?? firstShown(region, FOCUS_SELECTOR);
};

export { focusTarget };
