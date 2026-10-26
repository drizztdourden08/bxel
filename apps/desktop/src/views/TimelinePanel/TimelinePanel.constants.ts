/* @layer renderer-app @kind constants */
import { addFrame } from '../../timeline/add-frame';
import { addTag } from '../../timeline/add-tag';
import { deleteFrames } from '../../timeline/delete-frames';
import { duplicateFrames } from '../../timeline/duplicate-frames';
import type { TimelineAction } from './TimelinePanel.type';

const TIMELINE_PANEL_TEXT = {
  frames: 'Frame actions',
  transport: 'Playback',
  previous: 'Previous frame',
  next: 'Next frame',
  play: 'Play',
  pause: 'Pause',
  loop: 'Loop preview',
  tagPick: 'Tag to play',
  tagName: 'Tag name',
  tagDirection: 'Tag loop mode',
  tagRepeat: 'Tag repeat count, 0 plays forever',
  tagFacing: 'Tag facing',
  tagNoFacing: 'No facing',
  tagRange: 'Set range to picked frames',
  tagDelete: 'Delete tag',
  tagMirror: (flip: string): string => `A mirror of another tag, flipped ${flip}`,
  durationUnit: 'ms',
  pixelUnit: 'px',
} as const;

const TRANSFORM_TEXT = {
  menu: 'Transform animation',
  directions: 'New direction set...',
  spritesheet: 'Make spritesheet',
  split: 'Split to sprites',
  frames: 'Export frames as images',
} as const;

const FRAME_ACTIONS: readonly TimelineAction[] = [
  { id: 'add', label: 'Add frame', shortcut: null, icon: 'pixel-frame-add', run: addFrame },
  { id: 'duplicate', label: 'Duplicate frames', shortcut: null, icon: 'pixel-frame-duplicate', run: duplicateFrames },
  { id: 'delete', label: 'Delete frames', shortcut: 'Delete', icon: 'pixel-frame-delete', run: deleteFrames },
  { id: 'tag', label: 'Add tag on the picked frames', shortcut: null, icon: 'pixel-tag-add', run: addTag },
];

const TIMELINE_MENU = {
  label: 'Timeline actions',
  tag: '[data-tag-id]',
  frame: '[data-frame-id]',
  lane: '[data-tag-lane]',
  addTag: 'Add tag on the selected frames',
  onion: 'Onion skin',
  addFrame: 'Add frame',
  addFrom: 'Add frames from',
  fromSprites: 'Sprites...',
  fromStrip: 'A strip...',
  fromSheet: 'A sheet...',
  transform: 'Transform animation',
  directionSet: 'New direction set...',
  spritesheet: 'Make spritesheet',
  splitToSprites: 'Split to sprites',
  exportFrames: 'Export frames as images',
  duplicateFrames: 'Duplicate frames',
  earlier: 'Move earlier',
  later: 'Move later',
  deleteFrames: 'Delete frames',
  goTo: 'Go to frame',
  playFrom: 'Play from here',
  duration: 'Duration',
  otherDuration: 'Other...',
  selectAll: 'Select all frames',
  playTag: 'Play this tag',
  selectTagFrames: 'Select the frames of this tag',
  renameTag: 'Rename',
  direction: 'Direction',
  colour: 'Colour',
  automaticColour: 'Automatic colour',
  customColour: 'Custom...',
  alreadyAutomatic: 'The tag already has an automatic colour.',
  setRange: 'Set range to the selected frames',
  deleteTag: 'Delete tag',
  needFrames: 'Pick a frame first.',
  oneFrame: 'An animation keeps at least one frame.',
  firstFrame: 'The first frame is already at the start.',
  lastFrame: 'The last frame is already at the end.',
} as const;

const DURATION_CHOICES: readonly number[] = [50, 100, 200, 500];

const DURATION_STEP = 10;

const TIMELINE_KEYS = 'Comma Period ArrowLeft ArrowRight Home End Delete';

const STEP_KEYS: Readonly<Record<string, number>> = { ',': -1, '.': 1, ArrowLeft: -1, ArrowRight: 1 };

const MOVE_KEYS: Readonly<Record<string, number>> = { ArrowLeft: -1, ArrowRight: 1 };

const EDGE_KEYS: Readonly<Record<string, 'first' | 'last'>> = { Home: 'first', End: 'last' };

const NO_FACING = '';

const OFFSET_LIMIT = 4096;

const REPEAT_MAX = 255;

const FACING_ABBREVIATION = { n: 'N', ne: 'NE', e: 'E', se: 'SE', s: 'S', sw: 'SW', w: 'W', nw: 'NW' } as const;

export { DURATION_CHOICES, DURATION_STEP, EDGE_KEYS, FACING_ABBREVIATION, FRAME_ACTIONS, MOVE_KEYS, NO_FACING, OFFSET_LIMIT, REPEAT_MAX, STEP_KEYS, TIMELINE_KEYS, TIMELINE_MENU, TIMELINE_PANEL_TEXT, TRANSFORM_TEXT };
