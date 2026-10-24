/* @layer core @kind config */
import type { Anchor, Halves, RotationTerms } from './region.type';

const ANCHOR_HALVES: Readonly<Record<Anchor, Halves>> = {
  'top-left': { x: 0, y: 0 },
  top: { x: 1, y: 0 },
  'top-right': { x: 2, y: 0 },
  left: { x: 0, y: 1 },
  center: { x: 1, y: 1 },
  right: { x: 2, y: 1 },
  'bottom-left': { x: 0, y: 2 },
  bottom: { x: 1, y: 2 },
  'bottom-right': { x: 2, y: 2 },
};

const ANCHOR_NAMES = [
  'top-left',
  'top',
  'top-right',
  'left',
  'center',
  'right',
  'bottom-left',
  'bottom',
  'bottom-right',
] as const;

const RIGHT_ANGLE_TERMS: readonly RotationTerms[] = [
  { cos: 1, sin: 0 },
  { cos: 0, sin: 1 },
  { cos: -1, sin: 0 },
  { cos: 0, sin: -1 },
];

const FULL_TURN_DEGREES = 360;
const RIGHT_ANGLE_DEGREES = 90;
const ROUNDING_SCALE = 1e9;

export { ANCHOR_HALVES, ANCHOR_NAMES, FULL_TURN_DEGREES, RIGHT_ANGLE_DEGREES, RIGHT_ANGLE_TERMS, ROUNDING_SCALE };
