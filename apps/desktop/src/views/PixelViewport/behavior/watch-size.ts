/* @layer renderer-app @kind logic */
import { windowOf } from './window-of';

const stopNothing = (): void => undefined;

const watchSize = (element: Element, onResize: () => void): (() => void) => {
  const Observer = (windowOf(element) as Window & typeof globalThis).ResizeObserver;
  if (typeof Observer === 'undefined') return stopNothing;
  const observer = new Observer(() => onResize());
  observer.observe(element);
  return () => observer.disconnect();
};

export { watchSize };
