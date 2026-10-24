/* @layer renderer-app @kind constants */
import type { SymmetryAxis } from '../../stores/tool-store.type';

const RULER_CLASS: Readonly<Record<SymmetryAxis, string>> = {
  x: 'canvas-ruler canvas-ruler--x',
  y: 'canvas-ruler canvas-ruler--y',
};

export { RULER_CLASS };
