/* @layer renderer-app @kind constants */
import type { SymmetryAxis } from '../../stores/tool-store.type';

const RULER_CLASS: Readonly<Record<SymmetryAxis, string>> = {
  x: 'canvas-ruler canvas-ruler--x',
  y: 'canvas-ruler canvas-ruler--y',
};

const RULER_MENU = {
  zone: (axis: SymmetryAxis): string => `canvas.ruler.${axis}`,
  label: 'Ruler actions',
  remove: 'Remove this mirror axis',
  here: 'Put the mirror axis here',
  guide: 'Add guide here',
  clearGuides: 'Clear guides',
  noGuides: 'This sprite has no guides.',
  mirror: 'Mirror this axis',
  centre: 'Centre the mirror axis',
  centred: 'The mirror axis is already at the centre.',
} as const;

export { RULER_CLASS, RULER_MENU };
