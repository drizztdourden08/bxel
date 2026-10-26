/* @layer renderer-app @kind constants */
import { addFrame } from '../../timeline/add-frame';
import { addTag } from '../../timeline/add-tag';
import { clearCels } from '../../timeline/clear-cels';
import { deleteFrames } from '../../timeline/delete-frames';
import { duplicateFrames } from '../../timeline/duplicate-frames';
import { FIELD_LABEL } from '../../timeline/timeline.constants';
import { linkCels } from '../../timeline/link-cels';
import { unlinkCels } from '../../timeline/unlink-cels';
import type { TimelineAction } from './TimelinePanel.type';

const TIMELINE_PANEL_TEXT = {
  frames: 'Frame actions',
  cels: 'Cel actions',
  transport: 'Playback',
  previous: 'Previous frame',
  next: 'Next frame',
  play: 'Play',
  pause: 'Pause',
  loop: 'Loop playback',
  pingPong: 'Ping-pong playback',
  durationLabel: FIELD_LABEL.duration,
  durationUnit: 'ms',
  tagName: FIELD_LABEL.tagName,
  tagDirection: 'Tag loop mode',
  tagRange: 'Set range to selected frames',
  tagDelete: 'Delete tag',
  layerHidden: 'Hidden',
  layerLocked: 'Locked',
} as const;

const FRAME_ACTIONS: readonly TimelineAction[] = [
  { id: 'add', label: 'Add frame', shortcut: null, icon: 'pixel-frame-add', run: addFrame },
  { id: 'duplicate', label: 'Duplicate frames', shortcut: null, icon: 'pixel-frame-duplicate', run: duplicateFrames },
  { id: 'delete', label: 'Delete frames', shortcut: null, icon: 'pixel-frame-delete', run: deleteFrames },
  { id: 'tag', label: 'Add tag on the selected frames', shortcut: null, icon: 'pixel-tag-add', run: addTag },
];

const CEL_ACTIONS: readonly TimelineAction[] = [
  { id: 'link', label: 'Link cels across the selected frames', shortcut: null, icon: 'pixel-linked-cel', run: linkCels },
  { id: 'unlink', label: 'Unlink cels', shortcut: null, icon: 'pixel-unlink-cel', run: unlinkCels },
  { id: 'clear', label: 'Clear cels', shortcut: 'Delete', icon: 'pixel-eraser', run: clearCels },
];

const TIMELINE_MENU = {
  label: 'Timeline actions',
  tag: '[data-tag-id]',
  cel: '[data-frame-id][data-layer-id]',
  head: '[data-frame-id]',
  rowLabel: '[data-layer-id]:not([data-frame-id])',
  lane: '[data-tag-lane]',
  link: 'Link cels across the selected frames',
  unlink: 'Unlink cels',
  addTag: 'Add tag on the selected frames',
  onion: 'Onion skin',
  frame: 'Frame',
  layer: 'Layer',
  visible: 'Visible',
  locked: 'Locked',
  addFrame: 'Add frame',
  duplicateFrames: 'Duplicate frames',
  earlier: 'Move earlier',
  later: 'Move later',
  deleteFrames: 'Delete frames',
  clearCels: 'Clear cels',
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
  alreadyAutomatic: 'The tag already has an automatic colour.',
  setRange: 'Set range to the selected frames',
  deleteTag: 'Delete tag',
  needFrames: 'Pick two or more frames first.',
  oneFrame: 'A sprite keeps at least one frame.',
  firstFrame: 'The first frame is already at the start.',
  lastFrame: 'The last frame is already at the end.',
} as const;

const DURATION_CHOICES: readonly number[] = [50, 100, 200, 500];

const ZONE_ATTRIBUTE = 'data-timeline-zone';

const LANE_KINDS: ReadonlySet<string> = new Set(['park', 'addPick', 'frame', 'zone', 'tag']);

const FAR_FRAME = Number.POSITIVE_INFINITY;

const DURATION_STEP = 10;

const TIMELINE_KEYS = 'Enter Space Comma Period ArrowLeft ArrowRight ArrowUp ArrowDown Home End Delete';

const ARROWS: Readonly<Record<string, readonly [number, number]>> = {
  ArrowLeft: [-1, 0],
  ArrowRight: [1, 0],
  ArrowUp: [0, 1],
  ArrowDown: [0, -1],
};

const STEP_KEYS: Readonly<Record<string, number>> = { ',': -1, '.': 1 };

export { ARROWS, CEL_ACTIONS, DURATION_CHOICES, DURATION_STEP, FAR_FRAME, FRAME_ACTIONS, LANE_KINDS, STEP_KEYS, TIMELINE_KEYS, TIMELINE_MENU, TIMELINE_PANEL_TEXT, ZONE_ATTRIBUTE };
