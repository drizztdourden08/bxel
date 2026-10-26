/* @layer core @kind config */
import type { AnimDirection, AnimDirections, AnimFacing } from './animation.type';

const ANIM_DIRECTIONS: readonly AnimDirection[] = ['forward', 'reverse', 'pingpong', 'pingpongReverse'];
const FACINGS_FOUR: readonly AnimFacing[] = ['n', 'e', 's', 'w'];
const FACINGS_EIGHT: readonly AnimFacing[] = ['n', 'ne', 'e', 'se', 's', 'sw', 'w', 'nw'];
const ALL_FACINGS: readonly AnimFacing[] = FACINGS_EIGHT;
const FACING_SETS: Readonly<Record<AnimDirections, readonly AnimFacing[]>> = {
  none: [],
  four: FACINGS_FOUR,
  eight: FACINGS_EIGHT,
};
const MIRROR_FACING: Readonly<Partial<Record<AnimFacing, AnimFacing>>> = {
  e: 'w',
  w: 'e',
  ne: 'nw',
  nw: 'ne',
  se: 'sw',
  sw: 'se',
};
const DEFAULT_DIRECTION_PATTERN = '{tag}_{facing}';
const DEFAULT_ANIM_LOOP = { direction: 'forward', repeat: 0 } as const;
const MAX_ANIMATION_FRAMES = 4096;

export {
  ALL_FACINGS,
  ANIM_DIRECTIONS,
  DEFAULT_ANIM_LOOP,
  DEFAULT_DIRECTION_PATTERN,
  FACING_SETS,
  FACINGS_EIGHT,
  FACINGS_FOUR,
  MAX_ANIMATION_FRAMES,
  MIRROR_FACING,
};
