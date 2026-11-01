/* @layer renderer-app @kind constants */
import type { CommandDef } from '@drizztdourden08/brock-react';
import { useTimelineStore } from '../stores/useTimelineStore';
import { addFrame } from '../timeline/add-frame';
import { copyFrames } from '../timeline/copy-frames';
import { currentFocus } from '../timeline/current-focus';
import { duplicateFrames } from '../timeline/duplicate-frames';
import { escapeTimeline } from '../timeline/escape-timeline';
import { fitPick } from '../timeline/fit-pick';
import { moveFramesTo } from '../timeline/move-frames-to';
import { pasteFrames } from '../timeline/paste-frames';
import { selectAllFrames } from '../timeline/select-all-frames';
import { stepFacing } from '../timeline/step-facing';
import { stepTag } from '../timeline/step-tag';
import { stepZoom } from '../timeline/step-zoom';
import { tagOrEdit } from '../timeline/tag-or-edit';
import { togglePlayback } from '../timeline/toggle-playback';
import { COMMAND_ZONE } from './command-zone.constants';
import { COMMAND_GROUP } from './keymap.constants';
import type { KeyDef } from './timeline-key-command.type';

const group = COMMAND_GROUP.timeline;

const store = useTimelineStore;

const PLAIN_TARGET = 'button, a, [role="button"], [role="menuitem"], [role="combobox"], [role="slider"], [role="tab"], input, textarea, select, [role="dialog"]';

const onPlainTarget = (): boolean => {
  const active = document.activeElement;
  return !(active instanceof HTMLElement) || active.closest(PLAIN_TARGET) === null;
};

const pickedWidth = (): number => document.querySelector<HTMLElement>('.timeline__body')?.clientWidth ?? 600;

const KEYS: readonly KeyDef[] = [
  { id: 'timeline.key_play', label: 'Play or pause the animation', chord: 'Enter', when: onPlainTarget, run: () => togglePlayback() },
  { id: 'timeline.key_copy', label: 'Copy the picked frames', chord: 'Mod+C', run: () => void copyFrames(false) },
  { id: 'timeline.key_cut', label: 'Cut the picked frames', chord: 'Mod+X', run: () => void copyFrames(true) },
  { id: 'timeline.key_paste', label: 'Paste frames after the current frame', chord: 'Mod+V', run: () => void pasteFrames(false) },
  { id: 'timeline.key_paste_linked', label: 'Paste frames as linked copies', chord: 'Mod+Shift+V', run: () => void pasteFrames(true) },
  { id: 'timeline.key_duplicate', label: 'Duplicate the selected frames', chord: 'Mod+D', run: () => duplicateFrames() },
  { id: 'timeline.key_add_frame', label: 'Add a frame', chord: 'Alt+N', run: () => addFrame() },
  { id: 'timeline.key_select_all', label: 'Select all frames', chord: 'Mod+A', run: () => selectAllFrames() },
  { id: 'timeline.key_tag', label: 'Tag the selected frames or edit the picked tag', chord: 'F2', run: () => tagOrEdit() },
  { id: 'timeline.key_duration', label: 'Set the duration of the selected frames', chord: 'P', run: () => store.getState().setPopover({ kind: 'duration' }) },
  { id: 'timeline.key_time_mode', label: 'Show frame widths as durations', chord: 'T', run: () => store.getState().setTimeMode(!store.getState().timeMode) },
  { id: 'timeline.key_zoom_in', label: 'Larger frames', chord: ['Mod+Plus', 'Mod+='], run: () => store.getState().setZoom(stepZoom(store.getState().zoom, 1)) },
  { id: 'timeline.key_zoom_out', label: 'Smaller frames', chord: 'Mod+Minus', run: () => store.getState().setZoom(stepZoom(store.getState().zoom, -1)) },
  { id: 'timeline.key_fit_pick', label: 'Frame the picked frames', chord: 'F', run: () => fitPick(pickedWidth()) },
  { id: 'timeline.key_escape', label: 'Back to the current frame', chord: 'Escape', run: () => escapeTimeline() },
  { id: 'timeline.key_previous_tag', label: 'Go to the previous tag', chord: 'Mod+Left', run: () => void stepTag(-1) },
  { id: 'timeline.key_next_tag', label: 'Go to the next tag', chord: 'Mod+Right', run: () => void stepTag(1) },
  { id: 'timeline.key_previous_facing', label: 'Previous facing', chord: 'Mod+Alt+Left', run: () => void stepFacing(-1) },
  { id: 'timeline.key_next_facing', label: 'Next facing', chord: 'Mod+Alt+Right', run: () => void stepFacing(1) },
  { id: 'timeline.key_move_start', label: 'Move the selected frames to the start', chord: 'Alt+Home', run: () => void moveFramesTo(0) },
  { id: 'timeline.key_move_end', label: 'Move the selected frames to the end', chord: 'Alt+End', run: () => void moveFramesTo(Number.MAX_SAFE_INTEGER) },
];

const TIMELINE_KEY_COMMANDS: readonly CommandDef[] = KEYS.map((def) => ({
  ...def,
  group,
  zone: COMMAND_ZONE.timeline,
  whileTyping: false,
  when: () => currentFocus() !== null && (def.when?.() ?? true),
}));

export { TIMELINE_KEY_COMMANDS };
