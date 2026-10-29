/* @layer renderer-app @kind constants */
import type { AnimDirection } from '@bxel/document';
import { END_GUTTER_PX } from '../../timeline/track-layout.constants';
import type { IconName } from '@drizztdourden08/tessera';
import { addFrame } from '../../timeline/add-frame';
import { addTag } from '../../timeline/add-tag';
import { deleteFrames } from '../../timeline/delete-frames';
import { duplicateFrames } from '../../timeline/duplicate-frames';
import type { TimelineAction } from './TimelinePanel.type';

const TIMELINE_PANEL_TEXT = {
  frames: 'Frame actions',
  transport: 'Playback',
  first: 'First frame (Home)',
  previous: 'Previous frame',
  next: 'Next frame',
  last: 'Last frame (End)',
  play: 'Play',
  pause: 'Pause',
  playOptions: 'Play options',
  loop: 'Loop',
  once: 'Play once',
  pingpong: 'Ping-pong preview',
  subtags: 'Play subtags and repeats',
  rewind: 'Rewind on stop',
  speed: 'Speed',
  range: 'Range',
  units: 'Time units',
  unitNames: { ms: 'Milliseconds', seconds: 'Seconds', ticks: 'Ticks at 12 fps' },
  facing: 'Facing',
  facingNone: 'No facing',
  tagName: 'Tag name',
  tagDirection: 'Tag loop mode',
  tagRepeat: 'Tag repeat count, 0 plays forever',
  tagFacing: 'Tag facing',
  tagNoFacing: 'No facing',
  tagRange: 'Set range to picked frames',
  tagDelete: 'Delete tag',
  tagPopover: 'Edit tag',
  tagMirror: (flip: string): string => `A mirror of another tag, flipped ${flip}`,
  tagHint: 'Drag across frames here to add a tag',
  tags: 'Tags',
  ruler: 'Playhead',
  rulerValue: (number: number, total: number): string => `Frame ${number} of ${total}`,
  clearLoop: 'Clear the loop range',
  loopRange: (from: number, to: number): string => `Loop range, frames ${from} to ${to}`,
  onionBefore: (count: number): string => `Onion frames before, ${count}`,
  onionAfter: (count: number): string => `Onion frames after, ${count}`,
  zoom: 'Frame size',
  zoomIn: 'Larger frames',
  zoomOut: 'Smaller frames',
  zoomSize: (size: number): string => `${size} px`,
  fit: 'Fit all frames',
  fitShort: 'Fit',
  more: 'More timeline actions',
  settings: 'Animation settings...',
  timeMode: 'Time mode',
  groupFacing: 'Group by facing',
  durationCaption: 'Duration',
  offsetCaption: 'Offset',
  pivotCaption: 'Pivot',
  durationUnit: 'ms',
  pixelUnit: 'px',
  picked: (count: number): string => (count === 1 ? '1 frame picked' : `${count} frames picked`),
  mixed: 'Mixed',
  frameFields: 'Frame',
  setDuration: 'Set duration',
  toPosition: 'Move to position',
  positionLabel: 'Position in the animation',
  move: 'Move',
  presets: 'Presets',
  sameFps: 'Same fps',
  wholeAnimation: 'Whole animation',
  apply: 'Apply',
  scaleBy: 'Scale by',
  scaleCustom: 'Custom',
  dropTo: (position: number): string => `To position ${position}`,
  dropCopy: (position: number): string => `Duplicate to position ${position}`,
  dropLink: (position: number): string => `Linked copy to position ${position}`,
  editDuration: 'Edit the duration',
  resizeDuration: 'Drag to change the duration',
  linkedTo: (number: number): string => `Same sprite as frame ${number}`,
  shared: 'Shared sprite',
  clip: 'Clipped to a part of the sprite',
  empty: 'Empty frame',
  usedBy: 'Used by',
  openAtFrame: (number: number): string => `Open at frame ${number}`,
  tilePlays: (key: number, name: string, tag: string, start: string): string => `Tile ${key} plays ${name}, ${tag}, ${start}`,
  tileWhole: 'whole animation',
  tileTag: (name: string): string => `tag ${name}`,
  tileStart: { together: 'start together', random: 'start at random' },
  tileStill: 'This tile is still',
  tileEdit: 'Edit animation',
  tileNew: 'New animation from this tile',
  tileFrames: 'Frames of the tile animation',
  previewAll: 'Preview all facings',
  facingPad: 'Facings',
  addFacing: 'Add this facing',
  drawFacing: 'Draw this facing',
  mirrorFacing: (flip: string): string => `A mirror, flipped ${flip}`,
  readOnlyBanner: 'This animation is open read only. Playback, onion skin and zoom still work.',
} as const;

const FRAME_ACTIONS: readonly TimelineAction[] = [
  { id: 'add', label: 'Add frame', shortcut: 'Alt+N', icon: 'pixel-frame-add', run: addFrame },
  { id: 'duplicate', label: 'Duplicate frames', shortcut: 'Ctrl+D', icon: 'pixel-frame-duplicate', run: duplicateFrames },
  { id: 'delete', label: 'Delete frames', shortcut: 'Delete', icon: 'pixel-frame-delete', run: deleteFrames },
  { id: 'tag', label: 'Add tag on the picked frames', shortcut: 'F2', icon: 'pixel-tag-add', run: () => addTag() },
];

const TRANSFORM_TEXT = {
  menu: 'Transform animation',
  directions: 'New direction set...',
  spritesheet: 'Make spritesheet',
  split: 'Split to sprites',
  frames: 'Export frames as images',
} as const;

const DIRECTION_ICON: Readonly<Record<AnimDirection, IconName>> = {
  forward: 'arrow-right',
  reverse: 'arrow-left',
  pingpong: 'pixel-ping-pong',
  pingpongReverse: 'arrow-left-right',
};

const DURATION_CHOICES: readonly number[] = [50, 100, 200, 500];

const SCALE_CHOICES: readonly number[] = [0.5, 2];

const DURATION_STEP = 10;

const TIMELINE_KEYS = 'Comma Period ArrowLeft ArrowRight Home End Delete Enter Alt+ArrowLeft Alt+ArrowRight';

const STEP_KEYS: Readonly<Record<string, number>> = { ',': -1, '.': 1, ArrowLeft: -1, ArrowRight: 1 };

const MOVE_KEYS: Readonly<Record<string, number>> = { ArrowLeft: -1, ArrowRight: 1 };

const EDGE_KEYS: Readonly<Record<string, 'first' | 'last'>> = { Home: 'first', End: 'last' };

const NO_FACING = 'none';

const OFFSET_LIMIT = 4096;

const REPEAT_MAX = 255;

const COMPACT_WIDTH = 560;

const SHORT_HEIGHT = 180;

const END_GUTTER = END_GUTTER_PX;

const FACING_ABBREVIATION = { n: 'N', ne: 'NE', e: 'E', se: 'SE', s: 'S', sw: 'SW', w: 'W', nw: 'NW' } as const;

export {
  COMPACT_WIDTH,
  DIRECTION_ICON,
  DURATION_CHOICES,
  DURATION_STEP,
  EDGE_KEYS,
  END_GUTTER,
  FACING_ABBREVIATION,
  FRAME_ACTIONS,
  MOVE_KEYS,
  NO_FACING,
  OFFSET_LIMIT,
  REPEAT_MAX,
  SCALE_CHOICES,
  SHORT_HEIGHT,
  STEP_KEYS,
  TIMELINE_KEYS,
  TIMELINE_PANEL_TEXT,
  TRANSFORM_TEXT,
};
