/* @layer renderer-app @kind constants */
import type { AnimDirection, AnimFacing } from '@bxel/document';
import type { FrameBadge } from './timeline.type';

const TIMELINE_TEXT = {
  empty: 'Sprites are still images. Use an animation for frames.',
  emptyTitle: 'No animation is open',
  makeFromSprite: 'Make an animation from this sprite',
  makeFromSprites: (count: number): string => `Make an animation from ${count} sprites`,
  severalName: 'Animation',
  framesList: (numbers: readonly number[]): string => (numbers.length === 1 ? `frame ${numbers[0]}` : `frames ${numbers.join(', ')}`),
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
  tagColourCustom: 'Custom...',
  tagColourCustomLabel: 'Custom tag colour',
  tagColourLabel: (name: string): string => `${name} tag colour`,
  wholeAnimation: 'Whole animation',
  pickedFrames: 'Picked frames',
  loopRangeName: 'Loop range',
  frameLabel: (number: number, total: number, durationMs: number, words: readonly string[]): string =>
    [`Frame ${number} of ${total}, ${durationMs} milliseconds`, ...words].join(', '),
  linkedTo: (frame: number): string => `linked to frame ${frame}`,
  framesRange: (from: number, to: number): string => (from === to ? `frame ${from}` : `frames ${from} to ${to}`),
  count: (frames: number): string => (frames === 1 ? '1 frame' : `${frames} frames`),
  total: (frames: number, durationMs: number, fps: string): string => `${frames === 1 ? '1 frame' : `${frames} frames`}, ${durationMs} ms, ${fps}`,
  status: (number: number, total: number, durationMs: number): string => `Frame ${number} of ${total}, ${durationMs} ms`,
  fps: (value: number): string => `${Number.isInteger(value) ? value : value.toFixed(1)} fps`,
  tagLabel: (name: string, direction: string): string => `${name}, ${direction}`,
  mirrorLabel: (name: string, flip: string): string => `${name}, mirrored ${flip}`,
  moveHint: 'Alt and Left or Right moves the frame in the strip. Drag a frame to move it.',
  playHint: 'Enter plays and pauses, and so does Shift and Enter while you paint. Comma and period step by one frame.',
  stripHint: 'Left and Right pick a frame. Shift extends the pick. Delete removes the picked frames.',
  moved: (number: number, total: number): string => `Frame moved to position ${number} of ${total}`,
  readOnly: 'This animation is open read only.',
  needTwo: 'Pick two or more frames first.',
  nothingCopied: 'Copy some frames first.',
  cutElsewhere: 'Cut frames paste into the same animation. Use Copy to paste into another.',
  ownedElsewhere: 'Frames drawn on this animation stay here. Duplicate them, or share the sprite from the Sprites panel.',
  otherFile: 'The copied frames are from another file.',
  duration: 'Frame duration in milliseconds, applied to the picked frames',
  unit: 'ms',
  offsetX: 'Frame offset across',
  offsetY: 'Frame offset down',
  pivotX: 'Frame pivot across',
  pivotY: 'Frame pivot down',
  frameGroup: 'Frame placement',
  directions: 'Directions',
  splitDone: (count: number): string => (count === 1 ? '1 sprite was made from the frames.' : `${count} sprites were made from the frames.`),
  nothingToSplit: 'Every frame is already a sprite of its own.',
  spritesheetDone: (name: string): string => `Made the sheet ${name}. It follows the animation.`,
  stillImages: 'Sprites are still images. Use an animation for frames.',
  drawFacing: 'Draw this facing',
  facingLabel: (facing: string, found: boolean): string => (found ? `Face ${facing}` : `Face ${facing}, no tag`),
} as const;

const BADGE_TEXT: Readonly<Record<FrameBadge, string>> = {
  owned: 'Owned sprite',
  shared: 'Shared sprite',
  clip: 'Clipped',
  empty: 'Empty frame',
};

const TIMELINE_LABEL = {
  addFrame: 'Add frame',
  duplicateFrame: 'Duplicate frames',
  deleteFrame: 'Delete frames',
  moveFrame: 'Move frames',
  reverse: 'Reverse the frame order',
  mirror: 'Make a mirror tag',
  paste: 'Paste frames',
  linkFrames: 'Link frames',
  tagRange: 'Change the tag range',
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
  split: 'Split to sprites',
  spritesheet: 'Make spritesheet',
  directions: 'New direction set',
  drawFacing: 'Draw this facing',
  addFrames: 'Add frames',
} as const;


const TIMELINE_REF = { frame: 'frame', tag: 'tag', copy: 'copy', animation: 'animation', sheet: 'sheet' } as const;

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
  NEW_TAG_NAME,
  TAG_COLOURS,
  TAG_DIRECTION_TEXT,
  TAG_DIRECTIONS,
  TIMELINE_LABEL,
  TIMELINE_REF,
  TIMELINE_TEXT,
};
