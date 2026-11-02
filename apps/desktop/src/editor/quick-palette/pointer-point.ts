/* @layer renderer-app @kind logic */
import type { QuickPoint } from './quick-palette.type';

let last: QuickPoint | null = null;

const notePointer = (point: QuickPoint): void => {
  last = point;
};

const lastPointer = (): QuickPoint => last ?? { x: window.innerWidth / 2, y: window.innerHeight / 2 };

export { lastPointer, notePointer };
