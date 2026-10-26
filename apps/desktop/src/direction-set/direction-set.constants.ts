/* @layer renderer-app @kind constants */
import { DEFAULT_FRAME_DURATION_MS } from '@bxel/document';
import type { DirectionMode, DirectionSetSpec, MirrorPair } from './direction-set.type';

const DIRECTION_START: DirectionSetSpec = {
  mode: 'four',
  tag: 'walk',
  framesPerFacing: 4,
  mirrored: [],
  durationMs: DEFAULT_FRAME_DURATION_MS,
};

const FRAMES_MAX = 64;

const MIRROR_PAIRS: Readonly<Record<DirectionMode, readonly MirrorPair[]>> = {
  four: [{ mirrored: 'w', source: 'e' }],
  eight: [
    { mirrored: 'nw', source: 'ne' },
    { mirrored: 'w', source: 'e' },
    { mirrored: 'sw', source: 'se' },
  ],
};

const MODE_CHOICES = [
  { value: 'four', label: 'Four directions' },
  { value: 'eight', label: 'Eight directions' },
] as const;

const DIRECTION_TEXT = {
  title: 'New direction set',
  name: 'Tag name',
  nameHint: 'Each facing gets a tag with this name and its facing.',
  mode: 'Directions',
  frames: 'Frames per facing',
  duration: 'Frame duration in milliseconds',
  mirrored: 'Mirrored facings',
  mirroredHint: 'A mirrored facing plays the frames of its partner flipped, so you draw fewer frames.',
  mirrorLabel: (mirrored: string, source: string): string => `${mirrored} mirrors ${source}`,
  create: 'Create',
  cancel: 'Cancel',
  willMake: (drawn: number, frames: number, mirrors: number): string =>
    `${drawn} facings to draw, ${frames} frames${mirrors === 0 ? '' : `, ${mirrors} mirrored`}.`,
  badName: 'Give the tag a name.',
  replaces: 'The animation already has frames. The new frames come after them.',
} as const;

export { DIRECTION_START, FRAMES_MAX, DIRECTION_TEXT, MIRROR_PAIRS, MODE_CHOICES };
