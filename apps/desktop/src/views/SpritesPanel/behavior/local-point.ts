/* @layer renderer-app @kind logic */
import type { Point } from '@bxel/document';

const localPoint = (container: HTMLElement, clientX: number, clientY: number): Point => {
  const box = container.getBoundingClientRect();
  return { x: clientX - box.left, y: clientY - box.top };
};

export { localPoint };
