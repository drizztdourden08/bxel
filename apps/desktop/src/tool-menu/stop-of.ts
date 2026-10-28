/* @layer renderer-app @kind logic */
import { STOP_SELECTOR } from './stop-id-of.constants';

const stopOf = (target: EventTarget | null): HTMLElement | null =>
  target instanceof Element ? target.closest<HTMLElement>(STOP_SELECTOR) : null;

export { stopOf };
