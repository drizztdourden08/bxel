/* @layer renderer-app @kind logic */
import { STOP_SELECTOR } from './stop-id-of.constants';

const focusOptionsBar = (): boolean => {
  const stop = document.querySelector<HTMLElement>(`.options-bar ${STOP_SELECTOR}[tabindex="0"]`);
  stop?.focus();
  return stop !== null;
};

export { focusOptionsBar };
