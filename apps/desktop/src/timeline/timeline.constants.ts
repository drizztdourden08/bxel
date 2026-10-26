/* @layer renderer-app @kind constants */
import type { AnimDirection, AnimFacing } from '@bxel/document';
import type { FrameBadge } from './timeline.type';

const TIMELINE_TEXT = {
  empty: 'Sprites are still images. An animation holds the frames.',
  emptyTitle: 'No animation is open',
  makeFromSprite: 'Make an animation from this sprite',
  openAnimation: 'Open an animation',
  noAnimations: 'This project has no animations yet.',
  title: 'Timeline',
  region: 'Timeline controls',
  strip: 'Frames',
  transport: 'Playback',
  frames: 'Frame actions',
  onion: 'Onion skin',
  tag: 'Tag',
  tagColour: 'Tag colour',
  tagColourAuto: 'Automatic colour',
  tagColourLabel: (name: string): string => `${name} tag colour`,
  wholeAnimation: 'Whole animation',
  frameLabel: (number: number, durationMs: number, badges: string): string =>
    `Frame ${number}, ${durationMs} milliseconds${badges === '' ? '' : `, ${badges}`}`,
  count: (frames: number): string => (frames === 1 ? '1 frame' : `${frames} frames`),
  total: (frames: number, durationMs: number, fps: string): string => `${frames === 1 ? '1 frame' : `${frames} frames`}, ${durationMs} ms, ${fps}`,
  status: (number: number, total: number, durationMs: number): string => `Frame ${number} of ${total}, ${durationMs} ms`,
  fps: (value: number): string => `${Number.isInteger(value) ? value : value.toFixed(1)} fps`,
  tagLabel: (name: string, direction: string): string => `${name}, ${direction}`,
  mirrorLabel: (name: string, flip: string): string => `${name}, mirrored ${flip}`,
  moveHint: 'Alt and Left or Right moves the frame in the strip. Drag a frame to move it.',
  playHint: 'Enter or Space plays and pauses. Comma and period step by one frame.',
  stripHint: 'Left and Right pick a frame. Shift extends the pick. Delete removes the picked frames.',
  moved: (number: number, total: number): string => `Frame moved to position ${number} of ${total}`,
  readOnly: 'This animation is open read only.',
  duration: 'Frame duration in milliseconds, applied to the picked frames',
  unit: 'ms',
  offsetX: 'Frame offset across',
  offsetY: 'Frame offset down',
  pivotX: 'Frame pivot across',
  pivotY: 'Frame pivot down',
  frameGroup: 'Frame placement',
  directions: 'Directions',
  facingLabel: (facing: string, found: boolean): string => (found ? `Face ${facing}` : `Face ${facing}, no tag`),
} as const;

const BADGE_TEXT: Readonly<Record<FrameBadge, string>> = {
  owned: 'Owned',
  shared: 'Shared',
  clip: 'Clip',
  empty: 'Empty',
};

const TIMELINE_LABEL = {
  addFrame: 'Add frame',
  duplicateFrame: 'Duplicate frames',
  deleteFrame: 'Delete frames',
  moveFrame: 'Move frames',
  duration: 'Set frame duration',
  addTag: 'Add tag',
  updateTag: 'Change tag',
  renameTag: 'Rename tag',
  colourTag: 'Colour tag',
  deleteTag: 'Delete tag',
  nudge: 'Move the frame',
  pivot: 'Move the frame pivot',
  placement: 'Place the frame',
  own: 'Draw on this frame',
  copy: 'Make a copy for this animation',
  make: 'Make an animation',
} as const;

const FIELD_LABEL = {
  duration: 'Frame duration in milliseconds, applied to the picked frames',
  tagName: 'Tag name',
} as const;

const TIMELINE_REF = { frame: 'frame', tag: 'tag', copy: 'copy', animation: 'animation' } as const;

const NEW_TAG_NAME = 'Tag';

const TAG_COLOURS: readonly string[] = ['rose', 'blue', 'amber', 'teal', 'violet', 'orange', 'lime', 'cyan', 'pink', 'green'];

const TAG_DIRECTIONS: readonly AnimDirection[] = ['forward', 'reverse', 'pingpong', 'pingpongReverse'];

const TAG_DIRECTION_TEXT: Readonly<Record<AnimDirection, string>> = {
  forward: 'Forward',
  reverse: 'Reverse',
  pingpong: 'Ping-pong',
  pingpongReverse: 'Reverse ping-pong',
};

const FACING_TEXT: Readonly<Record<AnimFacing, string>> = {
  n: 'north',
  ne: 'north east',
  e: 'east',
  se: 'south east',
  s: 'south',
  sw: 'south west',
  w: 'west',
  nw: 'north west',
};

const COMPASS: readonly (readonly (AnimFacing | null)[])[] = [
  ['nw', 'n', 'ne'],
  ['w', null, 'e'],
  ['sw', 's', 'se'],
];

export {
  BADGE_TEXT,
  COMPASS,
  FACING_TEXT,
  FIELD_LABEL,
  NEW_TAG_NAME,
  TAG_COLOURS,
  TAG_DIRECTION_TEXT,
  TAG_DIRECTIONS,
  TIMELINE_LABEL,
  TIMELINE_REF,
  TIMELINE_TEXT,
};
