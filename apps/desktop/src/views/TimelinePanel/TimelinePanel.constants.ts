/* @layer renderer-app @kind constants */
import { addFrame } from '../../timeline/add-frame';
import { addTag } from '../../timeline/add-tag';
import { clearCels } from '../../timeline/clear-cels';
import { deleteFrames } from '../../timeline/delete-frames';
import { duplicateFrames } from '../../timeline/duplicate-frames';
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
  durationLabel: 'Frame duration in milliseconds, applied to the selected frames',
  durationUnit: 'ms',
  tagName: 'Tag name',
  tagDirection: 'Tag loop mode',
  tagRange: 'Set range to selected frames',
  tagDelete: 'Delete tag',
  layerHidden: 'Hidden',
  layerLocked: 'Locked',
} as const;

const FRAME_ACTIONS: readonly TimelineAction[] = [
  { id: 'add', label: 'Add frame', shortcut: null, icon: 'frameAdd', run: addFrame },
  { id: 'duplicate', label: 'Duplicate frames', shortcut: null, icon: 'frameDuplicate', run: duplicateFrames },
  { id: 'delete', label: 'Delete frames', shortcut: null, icon: 'frameDelete', run: deleteFrames },
  { id: 'tag', label: 'Add tag on the selected frames', shortcut: null, icon: 'tagAdd', run: addTag },
];

const CEL_ACTIONS: readonly TimelineAction[] = [
  { id: 'link', label: 'Link cels across the selected frames', shortcut: null, icon: 'linkedCel', run: linkCels },
  { id: 'unlink', label: 'Unlink cels', shortcut: null, icon: 'unlinkCel', run: unlinkCels },
  { id: 'clear', label: 'Clear cels', shortcut: 'Delete', icon: 'eraser', run: clearCels },
];

const ZONE_ATTRIBUTE = 'data-timeline-zone';

const LANE_KINDS: ReadonlySet<string> = new Set(['park', 'addPick', 'frame', 'zone', 'tag', 'deleteTag']);

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

export { ARROWS, CEL_ACTIONS, DURATION_STEP, FAR_FRAME, FRAME_ACTIONS, LANE_KINDS, STEP_KEYS, TIMELINE_KEYS, TIMELINE_PANEL_TEXT, ZONE_ATTRIBUTE };
