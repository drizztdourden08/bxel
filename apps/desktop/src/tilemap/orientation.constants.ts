/* @layer renderer-app @kind constants */
import type { OrientRequest } from '@bxel/document';

const ORIENTATION_CHOICES: readonly { value: OrientRequest['kind']; label: string }[] = [
  { value: 'orthogonal', label: 'Orthogonal' },
  { value: 'isometric', label: 'Isometric' },
  { value: 'staggered', label: 'Staggered' },
  { value: 'hexagonal', label: 'Hexagonal' },
];

const STAGGER_AXIS_CHOICES = [
  { value: 'y', label: 'Rows shift' },
  { value: 'x', label: 'Columns shift' },
] as const;

const STAGGER_INDEX_CHOICES = [
  { value: 'odd', label: 'Odd lines' },
  { value: 'even', label: 'Even lines' },
] as const;

const ORIENTATION_TEXT = {
  label: 'Orientation',
  axis: 'Stagger axis',
  index: 'Shifted lines',
  side: 'Hexagon side in pixels',
  sideHint: '0 picks half the tile.',
  note: 'Isometric, staggered and hexagonal maps draw and pick tiles on their own grid. Tile sizes must be even.',
} as const;

export { ORIENTATION_CHOICES, ORIENTATION_TEXT, STAGGER_AXIS_CHOICES, STAGGER_INDEX_CHOICES };
