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

const FRAME_ACTIONS: readonly TimelineAction[] = [
  { id: 'add', label: 'Add frame', shortcut: null, icon: 'pixel-frame-add', run: addFrame },
  { id: 'duplicate', label: 'Duplicate frames', shortcut: null, icon: 'pixel-frame-duplicate', run: duplicateFrames },
  { id: 'delete', label: 'Delete frames', shortcut: 'Delete', icon: 'pixel-frame-delete', run: deleteFrames },
  { id: 'tag', label: 'Add tag on the picked frames', shortcut: null, icon: 'pixel-tag-add', run: addTag },
];

const DURATION_STEP = 10;

const TIMELINE_KEYS = 'Comma Period ArrowLeft ArrowRight Home End Delete';

const STEP_KEYS: Readonly<Record<string, number>> = { ',': -1, '.': 1, ArrowLeft: -1, ArrowRight: 1 };

const MOVE_KEYS: Readonly<Record<string, number>> = { ArrowLeft: -1, ArrowRight: 1 };

const EDGE_KEYS: Readonly<Record<string, 'first' | 'last'>> = { Home: 'first', End: 'last' };

const NO_FACING = '';

const OFFSET_LIMIT = 4096;

const REPEAT_MAX = 255;

const FACING_ABBREVIATION = { n: 'N', ne: 'NE', e: 'E', se: 'SE', s: 'S', sw: 'SW', w: 'W', nw: 'NW' } as const;

export { DURATION_STEP, EDGE_KEYS, FACING_ABBREVIATION, FRAME_ACTIONS, MOVE_KEYS, NO_FACING, OFFSET_LIMIT, REPEAT_MAX, STEP_KEYS, TIMELINE_KEYS, TIMELINE_PANEL_TEXT };
