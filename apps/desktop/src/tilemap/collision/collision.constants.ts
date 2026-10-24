/* @layer renderer-app @kind constants */
import type { CollisionKind } from './collision.type';

const COLLISION_KINDS: readonly { value: CollisionKind; label: string }[] = [
  { value: 'none', label: 'None' },
  { value: 'full', label: 'Full' },
  { value: 'rect', label: 'Box' },
  { value: 'polygon', label: 'Shape' },
];

const COLLISION_TEXT = {
  title: 'Collision',
  kind: 'Collision shape',
  rectLabel: 'Box',
  canvas: 'Collision shape editor',
  points: 'Points',
  pointsHint: 'x,y pairs, three or more',
  removePoint: 'Remove last point',
  help: 'Drag a box on the tile, or click to add a point and drag a point to move it.',
  none: 'No collision. Cells with this tile do not block.',
  full: 'The whole tile blocks.',
  overlay: 'Show collision',
} as const;

const COLLISION_RECT_FIELDS = [
  { id: 'x', label: 'X' },
  { id: 'y', label: 'Y' },
  { id: 'width', label: 'Width' },
  { id: 'height', label: 'Height' },
] as const;

const POINT_PAIR = /^(\d+)\s*,\s*(\d+)$/;

const COLLISION_VIEW = {
  box: 128,
  margin: 6,
  reach: 8,
  fill: 0.35,
  line: 2,
  handle: 3,
} as const;

export { COLLISION_KINDS, COLLISION_RECT_FIELDS, COLLISION_TEXT, COLLISION_VIEW, POINT_PAIR };
